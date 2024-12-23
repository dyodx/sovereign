import type { SERVICE } from "../interfaces";
import OpenAI from "openai";


export class WorldAI implements SERVICE {
    private openai: OpenAI;

    constructor() {
        if(!process.env.OPENAI_API_KEY) {
            throw new Error("OPENAI_API_KEY is not set");
        }
        
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async start() {
        console.log("Starting WorldAI");
    }

    async stop() {
        console.log("Stopping WorldAI");
    }
}