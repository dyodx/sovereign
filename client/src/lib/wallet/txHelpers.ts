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
