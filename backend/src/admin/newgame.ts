import {SVPRGM, SERVER_URL, COMPUTE_UNIT_PRICE, DB, CONNECTION, ACCOUNT_SEEDS} from "../common";
import { web3, BN } from "@coral-xyz/anchor";
import bs58 from "bs58";
import { sleep } from "bun";
import { serializeUint64, ByteifyEndianess } from "byteify";


await createGame();

async function createGame(){    
    // Fetch the max game id from the db
    const maxGameId = await DB.game.findFirst({
        orderBy: {
            gameId: "desc",
        },
        select: {
            gameId: true,
        },
        take: 1
    });
    
    const newGameId: bigint = maxGameId ? maxGameId.gameId + 1n : 0n;

    const adminKey = web3.Keypair.generate();
    const worldAgentKey = web3.Keypair.generate();
    const brokerKey = web3.Keypair.generate();
    const collectionKey = web3.Keypair.generate();
    const journalistKey = web3.Keypair.generate();
    await requestAirdrops([adminKey.publicKey, worldAgentKey.publicKey, brokerKey.publicKey]);

    const newGameArgs = {
        slotStart: new BN(await CONNECTION.getSlot()),
        collectionUri: `${SERVER_URL}/collection/${newGameId}`,
        worldAgent: worldAgentKey.publicKey,
        brokerKey: brokerKey.publicKey,
        mintCost: new BN(100_000_000), // 0.1 SOL
        bountyPowThreshold: calculateThreshold(8000, 30*60)
    }

    //console.log("New Game Args: ", newGameArgs);
    const newGameIx = await SVPRGM.methods
    .initGame(new BN(newGameId.toString()), newGameArgs)
    .accountsPartial({
        payer: adminKey.publicKey,
        gameAccount: web3.PublicKey.findProgramAddressSync(
            [Buffer.from(ACCOUNT_SEEDS.GAME), Uint8Array.from(serializeUint64(newGameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN}))],
            SVPRGM.programId
        )[0],
        worldAgentWallet: web3.PublicKey.findProgramAddressSync(
            [Buffer.from(ACCOUNT_SEEDS.WALLET), Uint8Array.from(serializeUint64(newGameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN})), worldAgentKey.publicKey.toBuffer()],
            SVPRGM.programId
        )[0],
        gamePool: web3.PublicKey.findProgramAddressSync(
            [Buffer.from(ACCOUNT_SEEDS.POOL), Uint8Array.from(serializeUint64(newGameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN}))],
            SVPRGM.programId
        )[0],
        brokerEscrow: web3.PublicKey.findProgramAddressSync(
            [Buffer.from(ACCOUNT_SEEDS.BROKER_ESCROW), Uint8Array.from(serializeUint64(newGameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN}))],
            SVPRGM.programId
        )[0],
        collection: collectionKey.publicKey,
    })
    .signers([
       adminKey,
       collectionKey,
    ])
    .instruction();

    const estimatedCU = await estimateCU(adminKey.publicKey, [newGameIx]);
    // Send Transaction To Chain
    const tx = new web3.VersionedTransaction(new web3.TransactionMessage({
        payerKey: adminKey.publicKey,
        recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
        instructions: [
            web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: COMPUTE_UNIT_PRICE}),
            web3.ComputeBudgetProgram.setComputeUnitLimit({units: estimatedCU}),
            newGameIx
        ]
    }).compileToV0Message());    
    tx.sign([adminKey, collectionKey]);
    const sig = await CONNECTION.sendTransaction(tx);

    // Create DB Entries
    await DB.game.create({
        data: {
            gameId: newGameId,
            adminPrivateKey: bs58.encode(adminKey.secretKey),
            worldAgentPrivateKey: bs58.encode(worldAgentKey.secretKey),
            brokerPrivateKey: bs58.encode(brokerKey.secretKey),
            journalistPrivateKey: bs58.encode(journalistKey.secretKey),
        }
    });

    console.log("Initialized Game Sig: ", sig);
    return {
        gameId: newGameId,
        adminKey: adminKey,
        worldAgentKey: worldAgentKey,
        brokerKey: brokerKey,
        journalistKey: journalistKey,
        collectionKey: collectionKey,
    }
}

async function mintCitizen(gameSetup: any, playerKey: web3.Keypair){
    const citizenKey = web3.Keypair.generate();
    const gameAccountKey = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("game"), Uint8Array.from(serializeUint64(gameSetup.gameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN}))],
        SVPRGM.programId
    )[0];
    const worldAgentWalletKey = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("wallet"), Uint8Array.from(serializeUint64(gameSetup.gameId,{endianess: ByteifyEndianess.LITTLE_ENDIAN})), gameSetup.worldAgentKey.publicKey.toBuffer()],
        SVPRGM.programId
    )[0];

    const citizenIx = await SVPRGM.methods
    .mintCitizen()
    .accountsPartial({
        playerAuthority: playerKey.publicKey,
        worldAgentWallet: worldAgentWalletKey,
        collection: gameSetup.collectionKey.publicKey,
        citizenAsset: citizenKey.publicKey,
        gameAccount: gameAccountKey,
    })
    .instruction();

    const estimatedCU = await estimateCU(playerKey.publicKey, [citizenIx]);
    // Send Transaction To Chain
    const tx = new web3.VersionedTransaction(new web3.TransactionMessage({
        payerKey: playerKey.publicKey,
        recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
        instructions: [
            web3.ComputeBudgetProgram.setComputeUnitPrice({microLamports: COMPUTE_UNIT_PRICE}),
            web3.ComputeBudgetProgram.setComputeUnitLimit({units: estimatedCU}),
            citizenIx
        ]
    }).compileToV0Message());    
    tx.sign([playerKey, citizenKey]);
    const sig = await CONNECTION.sendTransaction(tx);
    console.log("Minted Citizen Sig: ", sig);
}

// 8k h/s was what hash_test ran on macos without any optimizations (multi threading and so on)
function calculateThreshold(hashesPerSecond: number = 8000, secondsToSolve: number = 30) {
    // Convert inputs to BigInt
    const H = BigInt(hashesPerSecond);
    const S = BigInt(secondsToSolve);
  
    // Calculate the difficulty product
    const difficulty = H * S;
  
    // Define 2^256 as a BigInt
    const twoTo256 = 1n << 256n; // 2^256
  
    // Calculate threshold = floor(2^256 / difficulty)
    const threshold = twoTo256 / difficulty;
  
    // Convert threshold BigInt to a 32-byte Uint8Array (big-endian)
    const bytes = new Uint8Array(32);
    let temp = threshold;
    for (let i = 31; i >= 0; i--) {
      bytes[i] = Number(temp & 0xFFn);
      temp >>= 8n;
    }
  
    return bytes.reverse(); // little endian
}

async function requestAirdrops(keys: web3.PublicKey[]){
    await Promise.all(keys.map(async (key) => {
        CONNECTION.requestAirdrop(key, 100*web3.LAMPORTS_PER_SOL)
    }));    
    await sleep(1000); // enough time for the airdrop to be processed
    return;
}

async function estimateCU(feePayer: web3.PublicKey, ixs: web3.TransactionInstruction[]) {
    try {
        console.log("Estimating CU for ", ixs.length, " instructions");
        try {
            const tx = new web3.VersionedTransaction(new web3.TransactionMessage({
                payerKey: feePayer,
                recentBlockhash: (await CONNECTION.getLatestBlockhash()).blockhash,
                instructions: ixs
            }).compileToV0Message());
            console.log("Simulating Transaction");
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