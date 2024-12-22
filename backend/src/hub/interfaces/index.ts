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