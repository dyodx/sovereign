import {
  address,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import type { Idl } from "@coral-xyz/anchor";
import bs58 from "bs58";
import idl from "./idl/programs.json";

const PROGRAM_ID = "4oVhv3o16X3XR99UgbFrWNKptoNBkg2hsbNY2nYPpv4a";
const HTTP_ENDPOINT = "http://localhost:8899";
const WS_ENDPOINT = "ws://localhost:8900";

const rpc = createSolanaRpc(HTTP_ENDPOINT);
const rpcSubscriptions = createSolanaRpcSubscriptions(WS_ENDPOINT);
const abortController = new AbortController();
const provider = new AnchorProvider(
  { ...rpc, ...rpcSubscriptions } as any,
  {} as any,
  { commitment: "confirmed" },
);
const program = new Program(idl as Idl, provider);

class ProgramMonitor {
  private minSlot: bigint = BigInt(0);
  private accountDiscriminators: Map<string, Uint8Array>;

  constructor() {
    this.accountDiscriminators = new Map();
    (idl as any).accounts.forEach((account: any) => {
      if (account.discriminator) {
        const pascalCaseName = account.name;
        const camelCaseName = pascalCaseName.charAt(0).toLowerCase() + pascalCaseName.slice(1);
        this.accountDiscriminators.set(camelCaseName, new Uint8Array(account.discriminator));
      }
    });
  }

  async start() {
    try {
      // Subscribe to logs
      const logsSubscription = await rpcSubscriptions
        .logsNotifications(
          { mentions: [address(PROGRAM_ID)] },
          { commitment: "confirmed" }
        )
        .subscribe({ abortSignal: abortController.signal });

      (async () => {
        for await (const log of logsSubscription) {
          console.log("\n=== Program Log ===");
          console.log(log.value.logs);
        }
      })();

      // Subscribe to program notifications
      const subscription = await rpcSubscriptions
        .programNotifications(address(PROGRAM_ID))
        .subscribe({ abortSignal: abortController.signal });

      for await (const notification of subscription) {
        await this.processNotification(notification);
      }
    } catch (error) {
      console.error("Monitor error:", error);
      throw error;
    }
  }

  private async processNotification(notification: any) {
    const slot = BigInt(notification.context.slot);

    // Skip notifs from outdated slots
    if (slot < this.minSlot) return;
    this.minSlot = slot;

    try {
      // Check for account updates
      const { account, pubkey } = notification.value;
      const accountData = new Uint8Array(bs58.decode(account.data));
      if (accountData.length < 8) return;

      const accountDiscriminator = accountData.slice(0, 8);

      for (const [accountType, discriminator] of this.accountDiscriminators) {
        if (this.compareUint8Arrays(accountDiscriminator, discriminator)) {
          try {
            const decodedData = program.coder.accounts.decode(
              accountType,
              Buffer.from(accountData)
            );

            console.log(`\n=== Account Update (Slot ${slot}) ===`);
            console.log(`Account: ${pubkey.toString()}`);
            console.log(`Type: ${accountType}`);
            console.log('Data:', decodedData);
            break;
          } catch (error) {
            continue;
          }
        }
      }
    } catch (error) {
      console.error("Error processing notification:", error);
    }
  }

  private compareUint8Arrays(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) return false;
    return a.every((byte, i) => byte === b[i]);
  }
}

const monitor = new ProgramMonitor();

process.on("SIGINT", () => {
  abortController.abort();
  process.exit(0);
});

monitor.start().catch(console.error);
