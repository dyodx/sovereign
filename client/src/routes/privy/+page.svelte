<script lang="ts">
	import { page } from '$app/stores';
	import Privy, {
		getAllUserEmbeddedSolanaWallets,
		type PrivyEmbeddedSolanaWalletProvider
	} from '@privy-io/js-sdk-core';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { Connection } from '@solana/web3.js';
	import { onDestroy, onMount } from 'svelte';
	import { authHandler } from '$lib/wallet/authStateHelpers';
	import { buildTransaction, buildRequest } from '$lib/wallet/txHelpers';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import { goto } from '$app/navigation';

	let privy_oauth_state = $page.url.searchParams.get('privy_oauth_state');
	let privy_oauth_code = $page.url.searchParams.get('privy_oauth_code');

	let privy: Privy | null = $state(null);
	let twitURL = $state(''); // twitter url to authorize account
	let user = $state(null as PrivyAuthenticatedUser | null);
	let provider = $state(
		null as Awaited<ReturnType<Privy['embeddedWallet']['getSolanaProvider']>> | null
	);
	let iframeSrc = $state('');
	let iframe = $state(null as HTMLIFrameElement | null);
	let handler: (e: MessageEvent) => void;
	let embeddedWallet = $state(null as PrivyEmbeddedSolanaWalletProvider | null);
	let address = $state('');
	let confirmedTx = $state('');

	onMount(async () => {
		await authHandler.initializePrivy({
			setUser: (newUser: PrivyAuthenticatedUser | null) => (user = newUser),
			setPrivy: (newPrivy: Privy | null) => (privy = newPrivy),
			setAddress: (newAddress: string | null) => (address = newAddress as string)
		});

		// trigger login with code if returning from twitter callback
		if (!user?.user.id && !twitURL && privy_oauth_code && privy_oauth_state) {
			await loginWithCode();
			goto('/dash');
		}

		iframeSrc = privy?.embeddedWallet.getURL()! as string;
		if (iframe?.contentWindow) {
			privy!.setMessagePoster(iframe.contentWindow as any);
			handler = (e: MessageEvent) => privy!.embeddedWallet.onMessage(e.data);
			window.addEventListener('message', handler);
		}
	});

	onDestroy(() => {
		if (typeof window !== 'undefined' && handler) {
			window.removeEventListener('message', handler);
		}
	});

	async function generateURL() {
		if (!privy) return console.error('privy not initialized');
		twitURL = await authHandler.generateTwitterAuthUrl({
			privy
		});
	}

	async function loginWithCode() {
		if (!privy) return console.error('privy not initialized');

		await authHandler.loginWithCode({
			privy: privy,
			privy_oauth_code: privy_oauth_code as string,
			privy_oauth_state: privy_oauth_state as string,
			setUser: (newUser: PrivyAuthenticatedUser | null) => (user = newUser)
		});
	}

	async function createEmbeddedWallet() {
		await walletHandler.createEmbeddedWallet({
			privy: privy as Privy,
			user: user as PrivyAuthenticatedUser,
			setAddress: (e) => (address = e as string),
			setProvider: (e) => (provider = e),
			setEmbeddedWallet: (e) => (embeddedWallet = e)
		});
	}

	async function sendOneLamportToSelf() {
		if (!provider) {
			await createEmbeddedWallet();
			sendOneLamportToSelf();
			return;
		}
		const connection = new Connection('http://127.0.0.1:8899');
		const { tx, message } = await buildTransaction.sendOneLamportToSelf(connection, address);
		await buildRequest(provider, tx, message, address);
		const confirmedSentTx = await connection.sendTransaction(tx);
		confirmedTx = confirmedSentTx;
	}
</script>

<p>userid: {user?.user.id}</p>
<p>address:{address}</p>
<p>hasProvider:{!!provider}</p>
<p>TXN:{confirmedTx}</p>
<hr />
<div class="flex flex-col items-start gap-4 p-4">
	<button onclick={generateURL} class="bg-panel p-2"> generateURL </button> <br />
	<a href={twitURL}>
		<p class="bg-panel p-2">Go To Twitter</p>
		<p class="line-clamp-2 max-w-[400px] overflow-hidden opacity-50">{twitURL}</p>
	</a>
	<br />
	<button onclick={loginWithCode} class="bg-panel p-2"> loginWithCode </button>
	<p>
		{privy_oauth_state?.substring(0, 8)}...
		{privy_oauth_code?.substring(0, 8)}...
	</p>
	<br />
	<button onclick={createEmbeddedWallet} class="bg-panel p-2"> createEmbeddedWallet </button> <br />
	<button onclick={sendOneLamportToSelf} class="bg-panel p-2"> send lamport </button> <br />
	<iframe
		bind:this={iframe}
		src={iframeSrc}
		style="width: 0; height: 0; border: none;"
		title="Privy embedded wallet"
	>
	</iframe>
</div>

<hr />

<div class="mx-auto grid h-[300px] w-screen max-w-[500px] place-items-center">
	<!-- IF NOT LOGGED IN - SHOW STEPS FOR LOGIN -->
	{#if user?.user.id}
		<!-- PRIVY READY -->
		<button class="rounded bg-panel p-2" onclick={() => goto('/dash')}> Back to Dash </button>
		<button class="rounded bg-panel p-2" onclick={sendOneLamportToSelf}> Send Lamport </button>
	{/if}
</div>
