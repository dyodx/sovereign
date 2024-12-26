import type { SERVICE } from "./interfaces";
import { SolanaIngress } from "./ingress";
import { Router } from "./router";
import { WorldAI } from "./ingress/world";

class ServiceManager {
    private services: SERVICE[] = [];
    private running = false;

    addService(service: SERVICE) {
        this.services.push(service);
    }

    async start() {
        this.running = true;
        
        // Start all services
        const startPromises = this.services.map(async (service) => {
            try {
                await service.start();
                console.log(`Started service: ${service.constructor.name}`);
            } catch (e) {
                console.error(`Failed to start service ${service.constructor.name}:`, e);
                throw e;
            }
        });

        // Wait for all services to start
        await Promise.all(startPromises);

        // Keep the process alive
        return new Promise<void>((resolve) => {
            process.on('SIGINT', async () => {
                console.log('\nReceived SIGINT. Gracefully shutting down...');
                await this.stop();
                resolve();
            });
            
            process.on('SIGTERM', async () => {
                console.log('\nReceived SIGTERM. Gracefully shutting down...');
                await this.stop();
                resolve();
            });
        });
    }

    private async stop() {
        this.running = false;
        
        // Gracefully stop all services that have a stop method
        for (const service of this.services) {
            if (service.stop) {
                try {
                    await service.stop();
                    console.log(`Stopped service: ${service.constructor.name}`);
                } catch (e) {
                    console.error(`Failed to stop service ${service.constructor.name}:`, e);
                }
            }
        }
    }
}

async function main() {
    try {
        const manager = new ServiceManager();

        // Add services
        manager.addService(new SolanaIngress());
        manager.addService(new Router());
        manager.addService(new WorldAI());
        
        // Start services and keep running
        await manager.start();
    } catch (e) {
        console.error('Error in main:', e);
        process.exit(1);
    }
}

// Run the application
main();