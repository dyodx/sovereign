import {
	ComputeBudgetProgram,
	Connection,
	PublicKey,
	SystemProgram,
	Transaction,
	TransactionMessage,
	VersionedTransaction
} from '@solana/web3.js';

async function sendOneLamportToSelf(connection: Connection, address: string) {
	const pkey = new PublicKey(address);

	const tx = new VersionedTransaction(
		new TransactionMessage({
			payerKey: pkey,
			recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
			instructions: [
				ComputeBudgetProgram.setComputeUnitPrice({ microLamports: 1_000_000 }),
				ComputeBudgetProgram.setComputeUnitLimit({ units: 100000 }),
				SystemProgram.transfer({
					fromPubkey: pkey,
					toPubkey: pkey,
					lamports: 1
				})
			]
		}).compileToV0Message()
	);

	const serialized = Buffer.from(tx.serialize()).toString('base64');

	return {
		tx,
		serialized
	};
}

export const buildTransaction = {
	sendOneLamportToSelf
};
