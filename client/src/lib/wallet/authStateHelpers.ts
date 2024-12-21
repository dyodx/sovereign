import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
import Privy, {
	getAllUserEmbeddedSolanaWallets,
	getUserEmbeddedSolanaWallet,
	LocalStorage,
	type PrivyEmbeddedSolanaWalletProvider
} from '@privy-io/js-sdk-core';
import { walletStore } from '$lib/stores/wallet.svelte';

// Auth state store
const AUTH_STORAGE_KEY = 'privy_auth_state';

// Initiate Privy (in onMount)
type initProps = {
	setUser: (newUser: PrivyAuthenticatedUser | null) => void;
	setPrivy: (newPrivy: Privy | null) => void;
	setAddress: (newAddress: string | null) => void;
};
async function initializePrivy(props: initProps) {
	const newPrivy = new Privy({
		appId: 'cm4rluhru04zmuj8pzs0hklmk',
		storage: new LocalStorage()
	});

	props.setPrivy(newPrivy);

	// Try to restore the previous session
	const storedUser = await loadAuthState(newPrivy);
	if (storedUser) {
		// user = storedUser;
		props.setUser(storedUser);

		// Initialize wallet if needed
		if (await newPrivy.embeddedWallet.hasEmbeddedWallet()) {
			const accounts = getAllUserEmbeddedSolanaWallets(storedUser.user);
			if (accounts.length > 0) {
				props.setAddress(accounts[0].address);
				walletStore.update((state) => ({
					...state,
					connected: true
				}));
			}
		}
	}
}

// Generate Twitter Oauth URL
async function generateTwitterAuthUrl(props: {
	privy: Privy;
	setTwitterAuthUrl?: (newTwitterAuthUrl: string) => void;
}) {
	let twitterAuthUrl = (await props.privy?.auth.oauth.generateURL(
		'twitter',
		'http://localhost:5173/privy'
	))!.url as string;

	if (props.setTwitterAuthUrl) {
		props.setTwitterAuthUrl(twitterAuthUrl);
	}

	return twitterAuthUrl;
}

// Save auth state
function saveAuthState(authUser: PrivyAuthenticatedUser) {
	if (typeof window !== 'undefined') {
		localStorage.setItem(
			AUTH_STORAGE_KEY,
			JSON.stringify({
				user: authUser,
				timestamp: new Date().getTime()
			})
		);
	}
}

// Load auth state
async function loadAuthState(
	privyInstance: Privy
): Promise<PrivyAuthenticatedUser | null> {
	if (typeof window === 'undefined') return null;

	const stored = localStorage.getItem(AUTH_STORAGE_KEY);
	if (!stored) return null;

	const { user: storedUser, timestamp } = JSON.parse(stored);

	// Check if the stored state is less than 24 hours old
	const now = new Date().getTime();
	const expired = now - timestamp > 24 * 60 * 60 * 1000;

	if (expired) {
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}

	try {
		// Verify the stored auth state is still valid
		const isAuthenticated =
			await privyInstance.embeddedWallet.hasEmbeddedWallet();
		if (!isAuthenticated) {
			localStorage.removeItem(AUTH_STORAGE_KEY);
			return null;
		}

		return storedUser;
	} catch (error) {
		console.error('Error verifying auth state:', error);
		localStorage.removeItem(AUTH_STORAGE_KEY);
		return null;
	}
}

// Login with a Twitter Oauth token
type loginWithCodeProps = {
	privy: Privy;
	privy_oauth_code: string;
	privy_oauth_state: string;
	setUser: (newUser: PrivyAuthenticatedUser | null) => void;
};
async function loginWithCode({
	privy,
	privy_oauth_code,
	privy_oauth_state,
	setUser
}: loginWithCodeProps) {
	try {
		const authenticatedUser = await privy?.auth.oauth.loginWithCode(
			privy_oauth_code as string,
			privy_oauth_state as string,
			'twitter'
		);

		if (authenticatedUser) {
			setUser(authenticatedUser);
			saveAuthState(authenticatedUser);
		}
	} catch (error) {
		console.error('Login failed:', error);
		localStorage.removeItem(AUTH_STORAGE_KEY);
	}
}

export const authHandler = {
	AUTH_STORAGE_KEY, // localstorage key
	initializePrivy, // initialize privy
	saveAuthState, // save existing state to local storage
	loadAuthState, // load existing state from local storage
	loginWithCode, // login with a Twitter Oauth token
	generateTwitterAuthUrl //generate Twitter Oauth URL
};
