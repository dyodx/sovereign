import { Connection } from "@solana/web3.js";
import { SovereignIDL, WS_URL, SVPRGM, REDIS_CHANNELS } from "../../common";
import type { SolanaEvent } from "../interfaces/solana";
import Redis from 'ioredis';
import type { SERVICE } from "../interfaces";

interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
}

export class SolanaIngress implements SERVICE {
    private wsConnection: Connection | null;
    private redis: Redis;
    private isRunning: boolean;
    private retryConfig: RetryConfig;
    private reconnectTimeout: ReturnType<typeof setTimeout> | null;
    private logSubscriptionId: number | null;

    constructor(retryConfig: Partial<RetryConfig> = {}) {
        this.wsConnection = null;
        this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
        this.isRunning = false;
        this.reconnectTimeout = null;
        this.logSubscriptionId = null;
        
        // Default retry configuration with exponential backoff
        this.retryConfig = {
            maxAttempts: retryConfig.maxAttempts || 5,
            baseDelay: retryConfig.baseDelay || 1000, // Start with 1 second
            maxDelay: retryConfig.maxDelay || 30000,  // Max 30 seconds
        };

        // Handle Redis connection errors
        this.redis.on('error', this.handleRedisError.bind(this));
    }

    private async createConnection(): Promise<Connection> {
        return new Connection(WS_URL, {
            commitment: "confirmed",
            wsEndpoint: WS_URL,
            confirmTransactionInitialTimeout: 60000,
        });
    }

    private calculateBackoff(attempt: number): number {
        const delay = Math.min(
            this.retryConfig.baseDelay * Math.pow(2, attempt),
            this.retryConfig.maxDelay
        );
        // Add jitter to prevent thundering herd
        return delay + Math.random() * 1000;
    }

    private async handleRedisError(error: Error): Promise<void> {
        console.error("Redis connection error:", error);
        // Implement Redis reconnection logic if needed
        if (!this.redis.status.includes('ready')) {
            await this.retryRedisConnection();
        }
    }

    private async retryRedisConnection(attempt: number = 0): Promise<void> {
        if (attempt >= this.retryConfig.maxAttempts) {
            console.error("Failed to reconnect to Redis after maximum attempts");
            return;
        }

        try {
            await this.redis.connect();
        } catch (error) {
            const backoff = this.calculateBackoff(attempt);
            console.log(`Retrying Redis connection in ${backoff}ms...`);
            setTimeout(() => this.retryRedisConnection(attempt + 1), backoff);
        }
    }

    private async setupLogSubscription(): Promise<void> {
        if (!this.wsConnection) return;

        try {
            // Cleanup existing subscription if any
            if (this.logSubscriptionId !== null) {
                await this.wsConnection.removeOnLogsListener(this.logSubscriptionId);
            }

            this.logSubscriptionId = this.wsConnection.onLogs(
                SVPRGM.programId,
                async ({err, logs, signature}) => {
                    if (err) {
                        console.error("Log subscription error:", err);
                        return;
                    }
                    
                    await this.handleLogs(logs, signature);
                },
                "confirmed"
            );
        } catch (error) {
            console.error("Error setting up log subscription:", error);
            throw error;
        }
    }

    private async handleLogs(logs: string[], signature: string): Promise<void> {
        for (const logstr of logs) {
            try {
                const logMatch = logstr.match(/Program data: (.*)/);
                if (logMatch) {
                    const decodedEvent = SVPRGM.coder.events.decode(logMatch[1]);
                    if (!decodedEvent) continue;

                    const event: SolanaEvent = {
                        txn: signature,
                        name: decodedEvent.name || "Unknown",
                        data: decodedEvent.data || "Unknown",
                    };
                    await this.processEvent(event);
                }
            } catch (error) {
                console.error(`Error processing log: ${logstr}`, error);
            }
        }
    }

    private async reconnect(attempt: number = 0): Promise<void> {
        if (!this.isRunning || attempt >= this.retryConfig.maxAttempts) {
            console.error("Failed to reconnect after maximum attempts");
            return;
        }

        try {
            // Cleanup existing connection
            if (this.wsConnection) {
                this.wsConnection.removeOnLogsListener(this.logSubscriptionId!);
                this.wsConnection = null;
            }

            // Create new connection
            this.wsConnection = await this.createConnection();
            await this.setupLogSubscription();
            console.log("Successfully reconnected to Solana");
        } catch (error) {
            const backoff = this.calculateBackoff(attempt);
            console.error(`Reconnection attempt ${attempt + 1} failed, retrying in ${backoff}ms...`);
            
            this.reconnectTimeout = setTimeout(
                () => this.reconnect(attempt + 1),
                backoff
            );
        }
    }

    public async start(): Promise<void> {
        console.log("Starting Monitor for Sovereign (Program ID: " + SovereignIDL.address + ")");
        console.log(`SolanaIngress listening on ${WS_URL}`);

        this.isRunning = true;

        try {
            this.wsConnection = await this.createConnection();
            await this.setupLogSubscription();
        } catch (error) {
            console.error("Initial connection failed:", error);
            await this.reconnect();
        }

        // Setup WebSocket connection health check
        setInterval(async () => {
            if (!this.wsConnection?.getSlot() && this.isRunning) {
                console.log("WebSocket disconnected, attempting to reconnect...");
                await this.reconnect();
            }
        }, 5000);
    }

    public async stop(): Promise<void> {
        this.isRunning = false;
        
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.wsConnection) {
            if (this.logSubscriptionId !== null) {
                await this.wsConnection.removeOnLogsListener(this.logSubscriptionId);
            }
            this.wsConnection = null;
        }

        this.redis.disconnect();
    }

    private async processEvent(event: SolanaEvent): Promise<void> {
        try {
            console.log("\n=== Event ===");
            console.log(`Name: ${event.name}`);
            console.log('Data:', JSON.stringify(event.data, null, 2));
            
            await this.redis.publish(REDIS_CHANNELS.EVENTS_QUEUE, JSON.stringify(event));
        } catch (error) {
            console.error("Error processing event:", error);
            // Optionally implement retry logic for failed event processing
        }
    }
}