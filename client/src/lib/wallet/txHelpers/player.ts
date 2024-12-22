import { initAnchor } from '$lib/deps';
import * as anchor from '@coral-xyz/anchor';
import {
	Connection,
	PublicKey,
	TransactionMessage,
	VersionedTransaction
} from '@solana/web3.js';
import { estimateCU, getGameAccount } from '$lib/wallet/txUtilities';

export async function registerPlayer(
	connection: Connection,
	address: string,
	twitterHandle: string
) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address); // authority
	const {
		Uint8Array: gameIdInBytes,
		gameAccountKey: gameAccount,
		getGameMetaData
	} = getGameAccount();

	const gameMetaData = await getGameMetaData();

	let [playerAccountKey] = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('player'), gameIdInBytes, pkey.toBytes()],
		SVPRGM.programId
	);
	let [playerWalletKey] = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('player_wallet'), gameIdInBytes, pkey.toBytes()],
		SVPRGM.programId
	);

	// const playerAccount =
	// 	await SVPRGM.account.player.fetchNullable(playerAccountKey);

	const registerTwitterIx = await SVPRGM.methods
		.registerPlayer({
			x_username: twitterHandle
		})
		.accountsPartial({
			playerAuthority: pkey,
			game: gameAccount,
			player: playerAccountKey,
			playerWallet: playerWalletKey
		})
		.instruction();

	const estimatedCU = await estimateCU(pkey, [registerTwitterIx], connection);
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
				registerTwitterIx
			]
		}).compileToLegacyMessage()
	);

	const message = Buffer.from(tx.message.serialize()).toString('base64');

	return {
		tx,
		message
	};
}
