import { walletStore } from '$lib/stores/wallet.svelte';
import Privy, {
	getAllUserEmbeddedSolanaWallets,
	type PrivyEmbeddedSolanaWalletProvider
} from '@privy-io/js-sdk-core';
import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
import { LAMPORTS_PER_SOL, PublicKey, type Connection } from '@solana/web3.js';

async function createEmbeddedWallet(props: {
	privy: Privy;
	user: PrivyAuthenticatedUser;
	setAddress?: (newAddress: string | null) => void;
	setProvider?: (newProvider: PrivyEmbeddedSolanaWalletProvider | null) => void;
	setEmbeddedWallet?: (
		newEmbeddedWallet: PrivyEmbeddedSolanaWalletProvider | null
	) => void;
}) {
	const { user, privy } = props;
	if (!user || !privy) return console.error('No user or privy');
	const [account] = getAllUserEmbeddedSolanaWallets(user!.user);
	const hasEmbeddedWallet = await privy?.embeddedWallet.hasEmbeddedWallet();
	if (account && hasEmbeddedWallet) {
		if (props.setAddress) {
			props.setAddress(account.address);
		}

		const newProvider = await privy.embeddedWallet.getSolanaProvider(
			account,
			account.address,
			'solana-address-verifier'
		);
		if (props.setProvider) {
			props.setProvider(newProvider);
		}
	} else {
		if (!props.setEmbeddedWallet) return console.error('No embedded wallet');
		const solanaProvider = await privy?.embeddedWallet.createSolana();
		props.setEmbeddedWallet(solanaProvider!.provider);
	}
}

async function getWalletBalance(connection: Connection, address: string) {
	let resolvedBalance = 0;
	if (connection && address !== '') {
		const publicKey = new PublicKey(address as string);
		connection // connection to solana rpc endpoint
			.getBalance(publicKey as PublicKey) // fetch balance from connection
			.then((data) => {
				resolvedBalance = data / LAMPORTS_PER_SOL; // correct the decimal placement
				walletStore.update((state) => ({
					...state,
					balance: resolvedBalance
				}));
			})
			.catch((error) => {
				console.error('Error fetching balance:', error);
				resolvedBalance = 0; // or whatever error value you want
			});
	}
	return resolvedBalance;
}

export const walletHandler = {
	createEmbeddedWallet,
	getWalletBalance
};
