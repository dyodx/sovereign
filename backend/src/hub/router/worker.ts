import type { SandboxedJob } from "bullmq";
import * as Jobs from "../interfaces/jobs";
import { SVPRGM, DB } from "../../common";


module.exports = async (job: SandboxedJob) => {
    console.log(`Worker received job: ${job.id} - ${job.name}`);
    try {
        switch(job.name) {
            case "registerNation":
                await registerNation(job.data as Jobs.RegisterNationJob);
                break;
            default:
                throw new Error(`Unknown job: ${job.name}`);
        }
    } catch (e: any){ 
        console.error(`Worker failed to process job: ${job.id} - ${job.name} - ${e.message}`);
    }
}

async function registerNation(job: Jobs.RegisterNationJob) {
    console.log(`Registering nation: ${job.nationId} for game: ${job.gameId}`);
    // We need the nation private key to create and send off the transaction
    const nation = await DB.worldLeaders.findUnique({
        where: {
            nationId: job.nationId,
        },
    });
    if (!nation) {
        throw new Error(`Nation not found: ${job.nationId}`);
    }

}