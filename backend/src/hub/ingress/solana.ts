import { address, createSolanaRpcSubscriptions } from "@solana/web3.js";
import { SovereignIDL, WS_URL, SVPRGM, REDIS_CHANNELS } from "../../common.ts";
import type { SolanaEvent } from "../interfaces/solana.ts";
import Redis from 'ioredis';

export class SolanaIngress {
    private rpcSubscriptions: any;
    private abortController: AbortController;
    private redis: Redis;
    constructor() {
        this.rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
        this.abortController = new AbortController();
        this.redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    }

    async start() {
        console.log("Starting Monitor for Sovereign (Program ID: " + SovereignIDL.address + ")");
        try {
            const logsSubscription = await this.rpcSubscriptions
            .logsNotifications(
                { mentions: [address(SovereignIDL.address)] },
                { commitment: "confirmed" }
            ).subscribe({ abortSignal: this.abortController.signal });
    
            // Process Logs
            (async () => {
                for await (const log of logsSubscription) {
                    if(log.value.logs) {
                        for(const logstr of log.value.logs) {
                            const logMatch = logstr.match(/Program data: (.*)/);
                            if(logMatch){
                                const event = SVPRGM.coder.events.decode(logMatch[1]) as SolanaEvent;
                                await this.processEvent(event)
                            }
                        }
                    }
                }
            })();
    
            /* --- We aren't indexing accounts for the API yet, just fetch from RPC --- */
            /*
            // Process Program Notifications
            // There will be a notification for each account update
            const subscription = await this.rpcSubscriptions
                .programNotifications(address(SovereignIDL.address))
                .subscribe({ abortSignal: this.abortController.signal });
            for await (const notification of subscription) {
                await this.processAccountUpdate(notification);
            }
            */
        } catch (error) {
            console.error("Monitor error:", error);
            throw error;
        }
    
    }

    async processEvent(event: SolanaEvent) {
        console.log("\n=== Event ===");
        console.log(`Name: ${event.name}`);
        console.log('Data:', JSON.stringify(event.data, null, 2));
        await this.redis.publish(REDIS_CHANNELS.EVENTS_QUEUE, JSON.stringify(event));
    }

    async processAccountUpdate(account: any) {
        console.log("\n=== Account Update ===");
        console.log(JSON.stringify(account, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));
        // Maybe just don't do anything here?
        // IF we index the account for the API we can push these updates to DB
        // But otherwise just fetch data from the RPC
    }
}