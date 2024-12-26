import Redis from 'ioredis';
import { REDIS_CHANNELS } from '../../common';
import type { SERVICE } from '../interfaces';
import { Queue, Worker } from 'bullmq';
import * as SolanaEvents from '../interfaces/solana';
import * as Jobs from '../interfaces/jobs';
import worker from './worker';

const REMOVE_OPTS = {
    removeOnComplete: {
        age: 3600, //keep up to 1 hour
        count: 100, //keep up to 100 jobs
    },
    removeOnFail: {
        age: 3600,
        count: 100,
    },
}

const WORKER_COUNT = 10;

export class Router implements SERVICE {
    private receiver: Redis;
    private router: Redis;
    private JOBS_QUEUE: Queue;
    private WORKERS: Worker[];

    constructor() {
        this.router = new Redis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });
        this.receiver = new Redis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null });
        this.JOBS_QUEUE = new Queue(REDIS_CHANNELS.JOBS_QUEUE, {connection: this.router});
        this.JOBS_QUEUE.setGlobalConcurrency(10); //todo: experiment with how many jobs can be run at once
        this.WORKERS = [];
        for(let i = 0; i < WORKER_COUNT; i++) {
            this.WORKERS.push(new Worker(REDIS_CHANNELS.JOBS_QUEUE, worker, { concurrency: 5, connection: this.router}));
        }
    }

    async start() {
        // Subscribe to EVENTS_QUEUE
        // For each event, determine RECIEVERS
        // For each RECIEVER, add a JOB to the JOBS_QUEUE
        console.log(`Router listening on ${this.router.options.host}:${this.router.options.port}`);
        try { 
            await this.receiver.subscribe(REDIS_CHANNELS.EVENTS_QUEUE, () => {
                console.log(`Router subscribed to ${REDIS_CHANNELS.EVENTS_QUEUE}`);
                
                this.receiver.on('message', (channel, message) => {
                    console.log(`Received event: ${message}`);
                    this.createJobs(JSON.parse(message));
                });
            });
        } catch (e: any) {
            console.error(`Error in router: ${e.message}`);
        }
    }

    async createJobs(event: {name: string, data: any, txn: string}) {
        // For each event, determine RECIEVERS
        // For each RECIEVER, add a JOB to the JOBS_QUEUE
        try {
            switch (event.name) {
                case "newGameEvent":
                    const evt = SolanaEvents.NewGameEvent.parse(event.data);
                    // This is a unique event where we need to batch register all nations
                    // Normally we'd fire a job per agent, but here we just want the worker to take care of it
                    // No need to invoke any agents 
                    await this.JOBS_QUEUE.add(
                        "registerAllNations",
                        {
                            gameId: evt.gameId,
                        } as Jobs.RegisterAllNationsJob,
                        REMOVE_OPTS
                    );
                    break;
                default:
                    throw new Error(`Unknown event: ${event.name}`);
            }
        } catch (e: any){
            console.error(`Error in createJobs: ${e.message}`);
        }
    }
}