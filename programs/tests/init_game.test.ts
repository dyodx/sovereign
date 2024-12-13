import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import type { Programs as Sovereign } from "../target/types/programs";
import SoverignIDL from "../target/idl/programs.json";
import { describe, it } from "bun:test";
const connection = new anchor.web3.Connection("http://localhost:8899", "confirmed");
const keypair = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(await Bun.file("./localnet-keys/admin.json").json())
);

describe("program", () => {
    const wallet = new anchor.Wallet(keypair);
    const provider = new anchor.AnchorProvider(connection, wallet, {});
    const soverign = new Program<Sovereign>(SoverignIDL as Sovereign, provider);

    const id = new anchor.BN(1)

    it("Mint Citizen", async () => {

        let collection = anchor.web3.Keypair.generate();

        const tx = await soverign.methods.initGame(id).accounts({
            payer: wallet.payer.publicKey,
            authority: wallet.publicKey,
            collection: collection.publicKey
        }).signers([collection, keypair]).rpc();
        console.log("Your transaction signature", tx);
    });
});