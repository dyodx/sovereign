import { initAnchor } from '$lib/deps';
import * as anchor from '@coral-xyz/anchor';
import {
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction
} from '@solana/web3.js';
import { estimateCU, getGameAccount } from '$lib/wallet/txUtilities';

export async function mintNewCitizen(connection: Connection, address: string) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address);
	const {
		Uint8Array: gameIdInBytes,
		gameAccountKey,
		getGameMetaData
	} = getGameAccount();

	const gameMetaData = await getGameMetaData();
	const citizenAsset = anchor.web3.Keypair.generate();

	const citizenMintIx = await SVPRGM.methods
		.mintCitizen()
		.accountsPartial({
			playerAuthority: pkey,
			gameAccount: gameAccountKey, // get admin key
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
