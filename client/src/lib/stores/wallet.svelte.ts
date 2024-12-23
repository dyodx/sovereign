import type { Connection } from '@solana/web3.js';
import { writable, type Writable } from 'svelte/store';

// Create wallet store
export const walletStore: Writable<{
	address: string | null;
	connected: boolean;
	balance: number; // Added balance here
	connection: Connection | null;
}> = writable({
	address: null,
	connected: false,
	balance: 0, // Default balance
	connection: null
});

export const updateWalletStore = {
	setConnection: (newConnection: Connection | null) => {
		walletStore.update((state) => ({ ...state, connection: newConnection }));
	}
};
