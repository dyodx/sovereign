// stores/privyStore.ts
import { writable } from 'svelte/store';
import Privy, {
	getAllUserEmbeddedSolanaWallets,
	type PrivyEmbeddedSolanaWalletProvider
} from '@privy-io/js-sdk-core';
import type { PrivyAuthenticatedUser } from '@privy-io/public-api';

type PrivyStore = {
	isInitialized: boolean;
	privy: Privy | null;
	twitURL: string;
	user: PrivyAuthenticatedUser | null;
	provider: Awaited<
		ReturnType<Privy['embeddedWallet']['getSolanaProvider']>
	> | null;
	iframeSrc: string;
	iframe: HTMLIFrameElement | null;
	embeddedWallet: PrivyEmbeddedSolanaWalletProvider | null;
	address: string;
	confirmedTx: string;
};

const initialState: PrivyStore = {
	isInitialized: false,
	privy: null,
	twitURL: '',
	user: null,
	provider: null,
	iframeSrc: '',
	iframe: null,
	embeddedWallet: null,
	address: '',
	confirmedTx: ''
};

export const privyStore = writable<PrivyStore>(initialState);

// Helper functions to update specific fields
export const updatePrivyStore = {
	setUser: (newUser: PrivyAuthenticatedUser | null) => {
		privyStore.update((state) => ({ ...state, user: newUser }));
	},
	setPrivy: (newPrivy: Privy | null) => {
		privyStore.update((state) => ({
			...state,
			privy: newPrivy,
			isInitialized: true
		}));
	},
	setAddress: (newAddress: string | null) => {
		if (newAddress === null) return console.error('No address');
		privyStore.update((state) => ({ ...state, address: newAddress }));
	}
	// Add other setters as needed
};
