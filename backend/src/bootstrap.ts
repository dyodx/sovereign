// Called ONCE to setup the environment
import {db, dbClient, NATION_STATES} from "./common";
import type { agents } from "../edgedb-js/interfaces";
import bs58 from "bs58";
import {web3} from "@coral-xyz/anchor";

main();
async function main() {
    // Create Agent Keypairs
    let agents: agents.Agent[] = [];
    for (let i = 1; i < NATION_STATES.length; i++) {
        agents.push({
            id: db.uuid_generate_v4(),
            agent_id: i,
            private_key: bs58.encode(web3.Keypair.generate().secretKey),
        });
    }

    const insertAgentsQuery = db.params({ agents: db.json }, (params: any) => {
        return db.for(db.json_array_unpack(params.agents), (agent: any) => {
            return db.insert(db.agents.Agent, {
                id: agent.id,
                agent_id: agent.agent_id,
                private_key: agent.private_key,
            });
        });
    })

    const result = await insertAgentsQuery.run(dbClient, { agents });
    console.log("New Agents Created: ", result);
    
    // Create Agent Personalities
}