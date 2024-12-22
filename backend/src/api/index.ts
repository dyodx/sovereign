import { Hono } from "hono";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { CONNECTION, DB, SERVER_URL, stringifyBigInt } from "../common.ts";

const app = new Hono();
export default {
    port: 5600,
    fetch: app.fetch,
};

/// ROUTES ///
app.get("/", (c) => c.text("Hello World")); // heartbeat

app.get("/airdrop", async (c) => {
    const publicKey = c.req.query("publicKey");
    if (!publicKey) {
        return c.text("Missing publicKey parameter", 400);
    }

    try {
        const signature = await CONNECTION.requestAirdrop(new PublicKey(publicKey), 10*LAMPORTS_PER_SOL); //10 SOL
        return c.json({ signature });
    } catch (error: any) {
        return c.text("Failed to request airdrop: " + error.message, 500);
    }
});

// Collection JSON
app.get("/collection", async (c) => {
    const gameId = c.req.query("gameId");
    if (gameId === undefined) {
        return c.text("Missing gameId parameter", 400);
    }

    return c.json({
        name: `Sovereign ${gameId}`,
        description: `Sovereign ${gameId}`,
        image: "https://utfs.io/f/HOLEiqUAKjUF7czVJ3wyWNui0pBOk8JVtAjGI24hfKoYEUTF",
        external_url: `${SERVER_URL}/game/${gameId}`,
        properties: {
            files: [
                {
                    uri: "https://utfs.io/f/HOLEiqUAKjUF7czVJ3wyWNui0pBOk8JVtAjGI24hfKoYEUTF",
                    type: "image/png"
                }
            ],
            category: "image",
        }
    }, 200);
});

app.get("/nations", async (c) => {
    const gameId = c.req.query("gameId");
    if (gameId === undefined) {
        return c.text("Missing gameId parameter", 400);
    }

    const nations = await DB.nationAccount.findMany({
        where: {
            gameId: BigInt(gameId)  
        }
    });

    return c.json(stringifyBigInt(nations));
});