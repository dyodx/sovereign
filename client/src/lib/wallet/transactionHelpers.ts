import {
	Connection,
	PublicKey,
	Transaction,
	SystemProgram,
	LAMPORTS_PER_SOL
} from '@solana/web3.js';
import type { Adapter } from '@svelte-on-solana/wallet-adapter-core';

export async function sendPayment(
	connection: Connection,
	wallet: Adapter,
	recipientAddress: string,
	amount: number
) {
	try {
		// Ensure wallet is connected
		if (!wallet.publicKey) {
			throw new Error('Wallet not connected');
		}

		// Create a new transaction
		const transaction = new Transaction().add(
			SystemProgram.transfer({
				fromPubkey: wallet.publicKey,
				toPubkey: new PublicKey(recipientAddress),
				lamports: amount * LAMPORTS_PER_SOL // Convert SOL to lamports
			})
		);

		// Get the latest blockhash
		const { blockhash } = await connection.getLatestBlockhash();
		transaction.recentBlockhash = blockhash;
		transaction.feePayer = wallet.publicKey;

		// Request signature from wallet
		const signedTransaction = await wallet.signTransaction(transaction);

		// Send the signed transaction
		const signature = await connection.sendRawTransaction(
			signedTransaction.serialize()
		);

		// Confirm the transaction
		const confirmation = await connection.confirmTransaction({
			signature,
			blockhash,
			lastValidBlockHeight: (await connection.getLatestBlockhash())
				.lastValidBlockHeight
		});

		if (confirmation.value.err) {
			throw new Error('Transaction failed');
		}

		return {
			success: true,
			signature
		};
	} catch (error) {
		console.error('Transaction error:', error);
		return {
			success: false,
			error: error.message
		};
	}
}

// Utility to check wallet balance
export async function getWalletBalance(
	connection: Connection,
	publicKey: PublicKey
): Promise<number> {
	const balance = await connection.getBalance(publicKey);
	return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
}
