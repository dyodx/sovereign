import { Hono } from "hono";
import { address, lamports } from "@solana/web3.js";
import { CONNECTION, SERVER_URL } from "../common.ts";

const app = new Hono();
export default app;

/// ROUTES ///
app.get("/", (c) => c.text("Hello World")); // heartbeat

app.get("/airdrop", async (c) => {
    const publicKey = c.req.param("publicKey");
    if (!publicKey) {
        return c.text("Missing publicKey parameter", 400);
    }

    try {
        const signature = CONNECTION.requestAirdrop(address(publicKey), lamports(BigInt(10_00_000_000))); //10 SOL
        return c.json({ signature });
    } catch (error: any) {
        return c.text("Failed to request airdrop: " + error.message, 500);
    }
});

// Collection JSON
app.get("/collection", async (c) => {
    const gameId = c.req.param("gameId");
    if (!gameId) {
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