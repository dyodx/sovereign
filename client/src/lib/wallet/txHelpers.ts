import type Privy from '@privy-io/js-sdk-core';
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
				SystemProgram.transfer({
					fromPubkey: pkey,
					toPubkey: pkey,
					lamports: 1
				})
			]
		}).compileToLegacyMessage()
	);
	const message = Buffer.from(tx.message.serialize()).toString('base64');

	return {
		tx,
		message
	};
}

type EmbeddedSolanaWalletProvider = Awaited<
	ReturnType<Privy['embeddedWallet']['getSolanaProvider']>
>;
/**
 * Prepares an unsigned VersionedTransaction
 * and signs it with the privy embedded wallet
 * updates the tx with necessary signatures
 *
 * @example
 * ```ts
			const { tx, message } = await buildTransaction.sendOneLamportToSelf(connection, address);
			await buildRequest(provider, tx, message, address);
			const confirmedSentTx = await connection.sendTransaction(tx);
 * ```
 * */
export async function buildRequest(
	provider: EmbeddedSolanaWalletProvider,
	tx: VersionedTransaction,
	message: string,
	address: string
) {
	const pkey = new PublicKey(address);

	const simpleSig = (
		await provider.request({
			method: 'signMessage',
			params: { message }
		})
	).signature;
	tx.addSignature(pkey, Uint8Array.from(Buffer.from(simpleSig, 'base64')));
	// sign that message ^^^ and attach the signature
}

export const buildTransaction = {
	sendOneLamportToSelf
};
