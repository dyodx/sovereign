import { AppKit, createAppKit } from '@reown/appkit';
import { SolanaAdapter } from '@reown/appkit-adapter-solana/react';
import { solana, solanaTestnet, solanaDevnet } from '@reown/appkit/networks';
import {
	PhantomWalletAdapter,
	SolflareWalletAdapter
} from '@solana/wallet-adapter-wallets';
import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const APPKIT_KEY = Symbol();
export let appkit: AppKit | null = null;

export function initializeAppKit(): AppKit | null {
	// Only run on client side
	if (!browser) return null;

	// 0. Set up Solana Adapter
	const solanaWeb3JsAdapter = new SolanaAdapter({
		wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
	});

	// 1. Project configuration
	const projectId = '3c4680c0d1b2b713aef4877af9d1d5f8';

	// 2. Metadata
	const metadata = {
		name: 'sovereign',
		description: 'AppKit Example',
		url: 'https://reown.com/appkit',
		icons: ['https://assets.reown.com/reown-profile-pic.png']
	};

	// 3. Create AppKit instance
	const appkit = createAppKit({
		adapters: [solanaWeb3JsAdapter],
		networks: [solana, solanaTestnet, solanaDevnet],
		metadata: metadata,
		projectId,
		features: {
			analytics: true
		}
	});

	return appkit;
}

export function getAppKit() {
	if (!browser) return null;
	if (!appkit && browser) {
		appkit = initializeAppKit();
	}
	return appkit;
}
