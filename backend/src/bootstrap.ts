// Called ONCE to setup the environment
import {NATION_STATES, DB} from "./common";
import bs58 from "bs58";
import {web3} from "@coral-xyz/anchor";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Bootstrap the environment
(() => {
    initalizeAgents();
})()

async function initalizeAgents() {
    // Check if agents already exist
    const agentsCheck = await DB.worldLeaders.findMany({take: 1});
    if(agentsCheck.length > 0){
        console.log(`Agents already exist, skipping creation`);
        return;
    }

    const characters = await Bun.file("./bootstrap/characters.json").json();
    let agents: any[] = [];
    for(let i = 0; i < characters.length; i++){
        agents.push({
            nationId: i + 1,
            privateKey: bs58.encode(web3.Keypair.generate().secretKey),
            character: characters[i],
        });
    }
    await DB.worldLeaders.createMany({
        data: agents,
    });
    console.log(`Created ${agents.length} agents`);
}

async function generateAgentPersonalities(){
    const system =
    `
You are a world leader generator for a geopolitical strategy game. 
You will be provided with a specific nation name by the user. 

Your task:
- Generate a single fictional world leader in JSON format (no additional commentary).
- Include the following keys in the JSON:
  1. nation (use the provided nation name)
  2. name (fictional name)
  3. bio (array of 3-7 short bullet points about achievements, milestones, or scandals)
  4. lore (array of 5-10 backstory elements or personality traits that highlight the leaders strengths and weaknesses, or their approaches to different crises they may face)
  5. strengths (array of 2-3 items where the leader excels)
  6. weaknesses (array of 2-3 items that counterbalance the strengths)
  7. stats (object with keys gdp, healthcare, environment, politicalStability each an integer between 5000 and 10000, reflecting the leaders strengths/weaknesses)
  8. adjectives (array of 2-4 descriptive words)
  9. sampleMessages (array of 2-3 short messages the leader might say in response to events)
  10. sampleBroadcasts (array of 2-3 short official announcements to the public)

Constraints:
- The leaders strengths and weaknesses must be balanced: the same number of each.
- Output must be valid JSON only. No extra keys, no additional text outside the JSON.
- stats values must reflect the leaders focus, strengths, and weaknesses, and be in the range [5000..10000].
    `

    let characters: any[] = [];
    // start at 1 because we use Solana for idx 0
    for(let i = 1; i < NATION_STATES.length; i++){
        const nation = NATION_STATES[i];
        const user = `Generate a leader for the following nation: ${nation}`

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{role: "system", content: system}, {role: "user", content: user}],
            response_format: {type: "json_object"},
        });
        characters.push(JSON.parse(response.choices[0].message.content as string));
        Bun.sleep(1000); // so we don't get rate limited

        console.log(`Generated leader for ${nation}`);
    }
    await Bun.write(`./bootstrap/characters.json`, JSON.stringify(characters, null, 2));
    console.log(`Finished generating ${NATION_STATES.length - 2} leaders`);
}