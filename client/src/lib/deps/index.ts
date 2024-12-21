import { Program, AnchorProvider, Wallet, web3 } from '@coral-xyz/anchor';
import type { Programs as Sovereign } from './sovereign'; // unfortuntely need to cp instead of rebuilding because when deploying we don't recompile on railway
import { PUBLIC_RPC_URL } from '$env/static/public';
import IDL from './sovereign.json';

export const SovereignIDL = IDL;
export const SVPRGM = new Program<Sovereign>(
	SovereignIDL as Sovereign,
	new AnchorProvider(
		new web3.Connection(PUBLIC_RPC_URL),
		new Wallet(web3.Keypair.generate())
	)
); // grab admin key from db based on game_id
