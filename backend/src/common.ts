import {Program, AnchorProvider, Wallet, web3} from "@coral-xyz/anchor";
import type { Programs as Sovereign } from "../deps/sovereign.ts"; // unfortuntely need to cp instead of rebuilding because when deploying we don't recompile on railway
import IDL from "../deps/sovereign.json";
import { createSolanaRpc } from "@solana/web3.js";
import { PrismaClient } from "@prisma/client";

export const DB = new PrismaClient();
export const RPC_URL:string = process.env.RPC_URL || "http://localhost:8899";
export const WS_URL:string = process.env.WS_URL || "ws://localhost:8900";
export const SERVER_URL = process.env.SERVER_URL || "http://localhost:3000";
export const CONNECTION = createSolanaRpc(RPC_URL);
export const COMPUTE_UNIT_PRICE = 1_000_000; // ~average confirmation times
export const SovereignIDL = IDL;
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