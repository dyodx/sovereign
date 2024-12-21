import { writable, type Writable } from 'svelte/store';

// Create wallet store
export const walletStore: Writable<{
	address: string | null;
	connected: boolean;
	balance: number; // Added balance here
}> = writable({
	address: null,
	connected: false,
	balance: 0 // Default balance
});
