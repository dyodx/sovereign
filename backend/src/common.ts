import {Program, AnchorProvider, Wallet, web3} from "@coral-xyz/anchor";
import type { Programs as Sovereign } from "../deps/sovereign.ts"; // unfortuntely need to cp instead of rebuilding because when deploying we don't recompile on railway
import SovereignIDL from "../deps/sovereign.json";
import { createSolanaRpc } from "@solana/web3.js";
import * as edgedb from "edgedb";
import e from "../edgedb/index.mjs";

const RPC_URL:string = process.env.RPC_URL || "http://localhost:8899";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
export const db = e;
export const dbClient = edgedb.createClient();
export const CONNECTION = createSolanaRpc(RPC_URL);
export const COMPUTE_UNIT_PRICE = 1_000_000;

export const SVPRGM = new Program<Sovereign>(
    SovereignIDL as Sovereign,  
    new AnchorProvider(
        new web3.Connection(RPC_URL),
        new Wallet(web3.Keypair.generate()
    ))); // grab admin key from db based on game_id

export const randomU64 = (): bigint => {
    const max = 2n ** 64n - 1n;
    return BigInt(Math.floor(Math.random() * Number(max)));
}