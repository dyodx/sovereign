import * as anchor from '@coral-xyz/anchor';
import type { Programs as Sovereign } from './sovereign'; // unfortuntely need to cp instead of rebuilding because when deploying we don't recompile on railway
import { PUBLIC_RPC_URL } from '$env/static/public';
import IDL from './sovereign.json';
import { Connection } from '@solana/web3.js';

export function initAnchor() {
	const SovereignIDL = IDL;
	const SVPRGM = new anchor.Program<Sovereign>(
		SovereignIDL as Sovereign,
		{ connection: new Connection(PUBLIC_RPC_URL) }
		// new anchor.AnchorProvider(new Connection(PUBLIC_RPC_URL), {})
	);
	return { SovereignIDL, SVPRGM };
}
