import {Program, web3} from "@coral-xyz/anchor";
import type { Programs as Sovereign } from "../deps/sovereign.ts"; // unfortuntely need to cp instead of rebuilding because when deploying we don't recompile on railway
import IDL from "../deps/sovereign.json";
import { Connection, TransactionInstruction, type Signer } from "@solana/web3.js";
import { PrismaClient } from "@prisma/client";

export const DB = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/app",
        },
    },
});
export const RPC_URL:string = process.env.SOLANA_RPC_URL || "http://localhost:8899";
export const WS_URL:string = process.env.SOLANA_WS_URL || "ws://localhost:8900";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
export const CONNECTION = new Connection(RPC_URL, {commitment: "confirmed"});
export const COMPUTE_UNIT_PRICE = 1_000_000; // ~average confirmation times
export const SovereignIDL = IDL;
export const SVPRGM = new Program<Sovereign>(SovereignIDL as Sovereign,  { connection: CONNECTION });
export const ACCOUNT_SEEDS = {
    GAME: "game",
    POOL: "pool",
    WALLET: "wallet",
    NATION: "nation",
    PLAYER: "player",
    STAKED_CITIZEN: "staked_citizen",
    BROKER_ESCROW: "broker_escrow",
    BOUNTY: "bounty",
}

export const REDIS_CHANNELS = {
    EVENTS_QUEUE: "EVENTS_QUEUE", // ingestion -> router
    JOBS_QUEUE: "JOBS_QUEUE", // router -> workers (agents)
    TASKS_QUEUE: "TASKS_QUEUE", // workers -> egress
}

// 0 is used to set Sol Balance on Wallet Accounts
export const NATION_STATES = [
    "Solana", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", 
    "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", 
    "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", 
    "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", 
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", 
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", 
    "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", 
    "Democratic People's Republic of Korea", "Democratic Republic of the Congo", 
    "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", 
    "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", 
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", 
    "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", 
    "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", 
    "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", 
    "Kuwait", "Kyrgyzstan", "Lao People's Democratic Republic", "Latvia", "Lebanon", 
    "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", 
    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", 
    "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", 
    "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", 
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", 
    "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", 
    "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", 
    "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", 
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", 
    "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", 
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", 
    "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania", 
    "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", 
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", 
    "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", 
    "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export async function estimateCU(feePayer: web3.PublicKey, ixs: web3.TransactionInstruction[]) {
    try {
        try {
            const tx = new web3.VersionedTransaction(new web3.TransactionMessage({
                payerKey: feePayer,
                recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
                instructions: ixs
            }).compileToV0Message());
            await CONNECTION.simulateTransaction(tx);
            const unitsConsumed = (await CONNECTION.simulateTransaction(tx)).value.unitsConsumed;
            if(unitsConsumed) return unitsConsumed + 20_000; 
            else throw new Error("Error Estimating CU")
        } catch (e: any) {
            console.log("Error Simulating Transaction: ", e.getLogs());
            return 0;
        }
    } catch (e) {
        throw e;
    }
}

export async function buildTxn(feePayer: web3.PublicKey, ixs: web3.TransactionInstruction[]) {
    const tx = new web3.VersionedTransaction(new web3.TransactionMessage({
        payerKey: feePayer,
        recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
        instructions: [
            web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: COMPUTE_UNIT_PRICE}),
            web3.ComputeBudgetProgram.setComputeUnitLimit({units: await estimateCU(feePayer, ixs)}),
            ...ixs
        ]
    }).compileToV0Message());
    return tx;
}

export const randomU64 = (): bigint => {
    const max = 2n ** 64n - 1n;
    return BigInt(Math.floor(Math.random() * Number(max)));
}

export const TRANSACTION_SIZE_LIMIT = 1000; // Maximum size in bytes (is actually 1232)
export const BASE_TRANSACTION_SIZE = 100;   // Approximate size of an empty transaction
export const SIGNER_SIZE = 64;
export function estimateInstructionSize(ix: TransactionInstruction): number {
    // Base instruction size
    let size = 40; // Approximate size for program id and accounts metadata
    
    // Add size of accounts
    size += ix.keys.length * 32; // 32 bytes per public key
    
    // Add size of data buffer
    size += ix.data.length;
    
    return size;
}

export function stringifyBigInt(data: any) {
    return JSON.stringify(data, (_, value) => 
        typeof value === 'bigint' ? value.toString() : value
      );
}