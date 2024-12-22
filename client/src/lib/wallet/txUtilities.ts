import { initAnchor } from '$lib/deps';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, type Connection } from '@solana/web3.js';
import { web3 } from '@coral-xyz/anchor';
import { GAME_ID } from './constants';
//@ts-expect-error: todo fix types later
import { serializeUint64, ByteifyEndianess } from 'byteify';

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

export async function getPlayerAccount(address: string) {
	const { SVPRGM } = initAnchor();

	const pkey = new PublicKey(address); // authority
	const { Uint8Array: gameIdInBytes, getGameMetaData } = getGameAccount();

	let [playerAccountKey] = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('player'), gameIdInBytes, pkey.toBytes()],
		SVPRGM.programId
	);
	const playerAccount =
		await SVPRGM.account.player.fetchNullable(playerAccountKey);

	console.log({ playerAccount });

	console.log({
		data: 'data',
		address,
		playerAccountKey,
		playerAccount
	});
	return {
		Uint8Array: playerAccountKey,
		Account: playerAccount
	};
}

export function getGameAccount() {
	const { SVPRGM } = initAnchor();

	const InBigInt = BigInt(GAME_ID);
	const InBytes = Uint8Array.from(
		serializeUint64(InBigInt, {
			endianess: ByteifyEndianess.LITTLE_ENDIAN
		})
	);

	const gameAccountKey = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('game'), InBytes],
		SVPRGM.programId
	)[0];

	async function getGameMetaData() {
		return await SVPRGM.account.game.fetch(gameAccountKey);
	}

	return {
		BigInt: InBigInt,
		Uint8Array: InBytes,
		gameAccountKey: gameAccountKey,
		getGameMetaData: getGameMetaData
	};
}
