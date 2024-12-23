import { initAnchor } from '$lib/deps';
import * as anchor from '@coral-xyz/anchor';
import {
	Connection,
	LAMPORTS_PER_SOL,
	PublicKey,
	TransactionMessage,
	VersionedTransaction
} from '@solana/web3.js';
import { estimateCU, getGameAccount } from '$lib/wallet/txUtilities';
//@ts-expect-error: todo fix types later
import { serializeUint8, ByteifyEndianess } from 'byteify';

export async function mintNewCitizen(connection: Connection, address: string) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address);
	const {
		Uint8Array: gameIdInBytes,
		gameAccountKey,
		getGameMetaData
	} = getGameAccount();

	const gameMetaData = await getGameMetaData();
	console.log({
		gameMetaData,
		bigNumber: gameMetaData.mintCost / LAMPORTS_PER_SOL
	});
	const citizenAsset = anchor.web3.Keypair.generate();

	const citizenMintIx = await SVPRGM.methods
		.mintCitizen()
		.accountsPartial({
			playerAuthority: pkey,
			game: gameAccountKey, // get admin key
			worldAgentWallet: anchor.web3.PublicKey.findProgramAddressSync(
				[
					Buffer.from('wallet'),
					gameIdInBytes,
					gameMetaData.worldAgent.toBytes()
				],
				SVPRGM.programId
			)[0],
			collection: gameMetaData.collection,
			citizenAsset: citizenAsset.publicKey // check metaplex
		})
		.signers([citizenAsset])
		.instruction();

	const estimatedCU = await estimateCU(pkey, [citizenMintIx], connection);
	const tx = new VersionedTransaction(
		new TransactionMessage({
			payerKey: pkey,
			recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
			instructions: [
				anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
					microLamports: 1_000_000 // todo turn into constant
				}),
				anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
					units: estimatedCU
				}),
				citizenMintIx
			]
		}).compileToLegacyMessage()
	);

	tx.sign([citizenAsset]);
	const message = Buffer.from(tx.message.serialize()).toString('base64');

	return {
		tx,
		message
	};
}

export async function stakeCitizen(
	connection: Connection,
	address: string,
	citizenAddress: string,
	nationId: number
) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address);
	const citizenPkey = new PublicKey(citizenAddress);
	const {
		Uint8Array: gameIdInBytes,
		gameAccountKey,
		getGameMetaData
	} = getGameAccount();

	const gameMetaData = await getGameMetaData();
	console.log({
		gameMetaData,
		bigNumber: gameMetaData.mintCost / LAMPORTS_PER_SOL
	});

	const nationIdInBytes = Uint8Array.from(
		serializeUint8(nationId, {
			endianess: ByteifyEndianess.LITTLE_ENDIAN
		})
	);

	// const citizenAsset = anchor.web3.Keypair.generate();
	const [stakedCitizenAccount] = anchor.web3.PublicKey.findProgramAddressSync(
		[
			Buffer.from('staked_citizen'),
			gameIdInBytes,
			nationIdInBytes,
			citizenPkey.toBytes()
		],
		SVPRGM.programId
	);

	const [nationAccount] = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('nation'), gameIdInBytes, nationIdInBytes],
		SVPRGM.programId
	);

	const stakeCitizenIx = await SVPRGM.methods
		.stakeCitizen({})
		.accountsPartial({
			playerAuthority: pkey,
			citizenAsset: citizenPkey,
			game: gameAccountKey,
			nation: nationAccount,
			stakedCitizen: stakedCitizenAccount,
			collection: gameMetaData.collection // wait for fix
		})
		.instruction();

	const estimatedCU = await estimateCU(pkey, [stakeCitizenIx], connection);
	const tx = new VersionedTransaction(
		new TransactionMessage({
			payerKey: pkey,
			recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
			instructions: [
				anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
					microLamports: 1_000_000 // todo turn into constant
				}),
				anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
					units: estimatedCU
				}),
				stakeCitizenIx
			]
		}).compileToLegacyMessage()
	);

	const message = Buffer.from(tx.message.serialize()).toString('base64');

	return {
		tx,
		message
	};
}
