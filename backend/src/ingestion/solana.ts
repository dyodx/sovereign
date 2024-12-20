import { address, createSolanaRpcSubscriptions } from "@solana/web3.js";
import { SovereignIDL, WS_URL, SVPRGM } from "../common.ts";

const rpcSubscriptions = createSolanaRpcSubscriptions(WS_URL);
const abortController = new AbortController();
let accountDiscriminators: Map<string, Uint8Array> = new Map();

interface Event {
    name: string;
    data: any;
}

SovereignIDL.accounts.forEach((account: any) => {
    if (account.discriminator) {
        const pascalCaseName = account.name;
        const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);
        accountDiscriminators.set(camelCaseName, new Uint8Array(account.discriminator));
    }
});

async function monitor() {
    console.log("Starting Monitor for Sovereign (Program ID: " + SovereignIDL.address + ")");
    try {
        const logsSubscription = await rpcSubscriptions
        .logsNotifications(
            { mentions: [address(SovereignIDL.address)] },
            { commitment: "confirmed" }
        ).subscribe({ abortSignal: abortController.signal });

        // Process Logs
        (async () => {
            for await (const log of logsSubscription) {
                if(log.value.logs) {
                    for(const logstr of log.value.logs) {
                        const logMatch = logstr.match(/Program data: (.*)/);
                        if(logMatch){
                            const event = SVPRGM.coder.events.decode(logMatch[1]) as Event;
                            await processEvent(event)
                        }
                    }
                }
            }
        })();

        // Process Program Notifications
        // There will be a notification for each account update
        const subscription = await rpcSubscriptions
        .programNotifications(address(SovereignIDL.address))
        .subscribe({ abortSignal: abortController.signal });
        for await (const notification of subscription) {
            //await processAccountUpdate(notification.value.account);
        }
    } catch (error) {
        console.error("Monitor error:", error);
        throw error;
    }
}

async function processEvent(event: Event) {
    console.log("\n=== Event ===");
    console.log(`Name: ${event.name}`);
    console.log('Data:', JSON.stringify(event.data, null, 2));
}

async function processAccountUpdate(account: any) {
    console.log("\n=== Account Update ===");
    console.log(JSON.stringify(account, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2));
    // check if data error, then fetch from rpc if needed
}

monitor();