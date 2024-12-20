import {poseidon4} from 'poseidon-lite';
import * as anchor from "@coral-xyz/anchor";

const MAX_252_BIT = (BigInt(2) ** BigInt(252)) - BigInt(1); // max for 252 bits

// game_id, issuer_pubkey, issuer_bounty_id, citizen_id
const inputs = [
    BigInt(1).toString(),
    BigInt('0x' + Buffer.from(new anchor.web3.PublicKey('2qPRnmigG7KBwnR26djXHdPuYBzBvYEsbZBeoNVeWzqr').toBytes()).toString('hex')).toString(),
    BigInt(1).toString(),
    BigInt('0x' + Buffer.from(new anchor.web3.PublicKey('2qPRnmigG7KBwnR26djXHdPuYBzBvYEsbZBeoNVeWzqr').toBytes()).toString('hex')).toString(),
]
console.log("Inputs: ", inputs);
const nonce = BigInt(1);
const threshold = MAX_252_BIT;

const bountyHash = poseidon4(inputs);
const bountyHashLimited = reduceTo252Bits(numberToUint8Array(bountyHash));
console.log("Bounty Hash Limited: ", bountyHashLimited.toString());

function reduceTo252Bits(bytes: Uint8Array, littleEndian = true) {
    // Convert bytes to BigInt based on endianness
    let value = 0n;
    if (littleEndian) {
        // Little-endian: read from right to left
        for (let i = bytes.length - 1; i >= 0; i--) {
            value = (value << 8n) | BigInt(bytes[i]);
        }
    } else {
        // Big-endian: read from left to right
        for (let i = 0; i < bytes.length; i++) {
            value = (value << 8n) | BigInt(bytes[i]);
        }
    }
    
    // Mask to 252 bits
    return value & MAX_252_BIT;
}

// Only used for logging
function numberToUint8Array(number: bigint, littleEndian:boolean = true) {
    const hex = number.toString(16);
    const paddedHex = hex.padStart(64, '0');
    const bytes = new Uint8Array(Math.ceil(hex.length / 2));
    
    if (littleEndian) {
        // Little-endian: store least significant bytes first
        for (let i = 0; i < bytes.length; i++) {
            const idx = bytes.length - 1 - i;
            bytes[i] = parseInt(paddedHex.slice(idx * 2, (idx + 1) * 2), 16);
        }
    } else {
        // Big-endian: store most significant bytes first
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(paddedHex.slice(i * 2, (i + 1) * 2), 16);
        }
    }
    return bytes;
}

// Using reduce to build the number
function toBigInt(uint8Array: Uint8Array, littleEndian:boolean = true) {
    let endianArray = littleEndian ? uint8Array.reverse() : uint8Array;
    return endianArray.reduce((acc, value) => (acc << 8n) + BigInt(value), 0n);
};