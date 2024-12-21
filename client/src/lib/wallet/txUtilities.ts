import type { Connection } from '@solana/web3.js';
import { web3 } from '@coral-xyz/anchor';

export async function estimateCU(
	feePayer: web3.PublicKey,
	ixs: web3.TransactionInstruction[],
	connection: Connection
) {
	try {
		console.log('Estimating CU for ', ixs.length, ' instructions');
		try {
			const tx = new web3.VersionedTransaction(
				new web3.TransactionMessage({
					payerKey: feePayer,
					recentBlockhash: (await connection.getLatestBlockhash()).blockhash,
					instructions: ixs
				}).compileToV0Message()
			);
			console.log('Simulating Transaction');
			await connection.simulateTransaction(tx);
			const unitsConsumed = (await connection.simulateTransaction(tx)).value
				.unitsConsumed;
			if (unitsConsumed) return unitsConsumed + 20_000;
			else throw new Error('Error Estimating CU');
		} catch (e: any) {
			console.log('Error Simulating Transaction: ', e.getLogs());
			return 0;
		}
	} catch (e) {
		throw e;
	}
}
