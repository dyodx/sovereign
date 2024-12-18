import { writable, type Writable } from 'svelte/store';

// Create wallet store
export const walletStore: Writable<{
  address: string | null;
	connected: boolean;
}> = writable({
  address: null,
	connected: false
});
