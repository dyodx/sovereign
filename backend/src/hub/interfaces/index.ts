export * from "./solana.ts";

export interface SERVICE {
    start(): Promise<void>;
    stop?(): Promise<void>;
}

export interface EVENT_QUEUE_EVENT {
    name: string;
    data: any;
}

export interface JOBS_QUEUE_EVENT {
    name: string;
    receiver: string;
    data: any;
}

export interface TASKS_QUEUE_EVENT {
    name: string;
    actionType: string;
    data: any;
}

export interface WorldLeader {
    nation: string;
    name: string;
    bio: string[];
    lore: string[];
    strengths: string[];
    weaknesses: string[];
    stats: {
        gdp: number;
        healthcare: number;
        environment: number;
        politicalStability: number;
    };
    adjectives: string[];
    sampleMessages: string[];
    sampleBroadcasts: string[];
}