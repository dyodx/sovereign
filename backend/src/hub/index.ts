import { SolanaIngress } from "./ingress";
import { Router } from "./router";


// Instance all Hub classes and run them
main();

async function main() {
    try {
        // INGRESS
        const solanaIngress = new SolanaIngress();
        solanaIngress.start();

        // ROUTER
        const router = new Router();
        router.start();

        // EGRESS
    } catch (e: any) {
        console.error(`Error in main: ${e.message}`);
    }
}