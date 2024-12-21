import Redis from 'ioredis';
import { REDIS_CHANNELS } from '../../common';

export class Router {
    private router: Redis;
    constructor() {
        this.router = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    }

    async start() {
        // Subscribe to EVENTS_QUEUE
        // For each event, determine RECIEVERS
        // For each RECIEVER, add a JOB to the JOBS_QUEUE
        console.log("Starting Router");
        try { 
            await this.router.subscribe(REDIS_CHANNELS.EVENTS_QUEUE, () => {
                console.log(`Router subscribed to ${REDIS_CHANNELS.EVENTS_QUEUE}`);
                
                this.router.on('message', (channel, message) => {
                    console.log(`Received event: ${message}`);
                });
            });
        } catch (e: any) {
            console.error(`Error in router: ${e.message}`);
        }
    }

    async createJobs(event: {name: string, data: any}) {
        // For each event, determine RECIEVERS
        // For each RECIEVER, add a JOB to the JOBS_QUEUE
        try {
            switch (event.name) {
                case "newGameEvent":
                    break;
                default:
                    throw new Error(`Unknown event: ${event.name}`);
            }
        } catch (e: any){
            console.error(`Error in createJobs: ${e.message}`);
        }
    }
}