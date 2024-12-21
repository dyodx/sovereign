import { initAnchor } from '$lib/deps';
import * as anchor from '@coral-xyz/anchor';
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
//
//@ts-expect-error: todo fix types later
import { serializeUint64, ByteifyEndianess } from 'byteify';
import { estimateCU } from './txUtilities';

async function sendOneLamportToSelf(connection: Connection, address: string) {
	const { SVPRGM } = initAnchor();
	console.log({ SVPRGM });

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

async function mintNewCitizen(connection: Connection, address: string) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address);
	const currentGameId = 0n;
	const gameId = Uint8Array.from(
		serializeUint64(currentGameId, {
			endianess: ByteifyEndianess.LITTLE_ENDIAN
		})
	);

	// todo: create store for gameid, and game account (metadata)
	const gameAccountKey = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('game'), gameId],
		SVPRGM.programId
	)[0];

	const gameMetaData = await SVPRGM.account.game.fetch(gameAccountKey);

	const citizenAsset = anchor.web3.Keypair.generate();

	const citizenMintIx = await SVPRGM.methods
		.mintCitizen()
		.accountsPartial({
			playerAuthority: pkey,
			gameAccount: gameAccountKey, // get admin key
			worldAgentWallet: anchor.web3.PublicKey.findProgramAddressSync(
				[Buffer.from('wallet'), gameId, gameMetaData.worldAgent.toBytes()],
				SVPRGM.programId
			)[0],
			collection: gameMetaData.collection,
			citizenAsset: citizenAsset.publicKey // check metaplex
			// mplCoreProgram: '',
			// systemProgram: ''
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
	return simpleSig;
	// tx.addSignature(pkey, Uint8Array.from(Buffer.from(simpleSig, 'base64')));
	// sign that message ^^^ and attach the signature
}

export const buildTransaction = {
	sendOneLamportToSelf,
	mintNewCitizen
};
