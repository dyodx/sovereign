import { writable, type Writable } from 'svelte/store';
import type { Adapter, WalletAdapter } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

// Create wallet store
export const walletStore: Writable<{
	wallet: WalletAdapter | null;
	publicKey: PublicKey | null;
	connected: boolean;
}> = writable({
	wallet: null,
	publicKey: null,
	connected: false
});

// Create wallet adapters
export function createWalletAdapters() {
	const adapters = [new PhantomWalletAdapter()];

	// Configure network
	const network = clusterApiUrl('mainnet-beta', false); // or 'mainnet-beta'
	const rpc =
		'https://mainnet.helius-rpc.com/?api-key=448adf9e-7365-467a-843d-1adfde85dbd9';
	console.log({ network });
	const connection = new Connection(rpc, 'confirmed');

	return {
		adapters,
		connection
	};
}

// Wallet connection utility
export function connectWallet(adapter: Adapter) {
	if (adapter.readyState === 'Installed') {
		adapter
			.connect()
			.then(() => {
				walletStore.update((store) => ({
					...store,
					wallet: adapter as WalletAdapter,
					publicKey: adapter.publicKey,
					connected: true
				}));
			})
			.catch((error: Error) => {
				console.error('Wallet connection failed', error);
			});
	}
}

// Disconnect wallet
export function disconnectWallet(adapter: Adapter) {
	adapter
		.disconnect()
		.then(() => {
			walletStore.update((store) => ({
				...store,
				wallet: null,
				publicKey: null,
				connected: false
			}));
		})
		.catch((error: Error) => {
			console.error('Wallet disconnection failed', error);
		});
}
