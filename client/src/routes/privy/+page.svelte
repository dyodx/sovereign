<script lang="ts">
	import { page } from '$app/stores';
	import Privy, {
		getAllUserEmbeddedSolanaWallets,
		type PrivyEmbeddedSolanaWalletProvider
	} from '@privy-io/js-sdk-core';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import {
		Connection,
		PublicKey,
		SystemProgram,
		TransactionMessage,
		VersionedTransaction
	} from '@solana/web3.js';
	import { onDestroy, onMount } from 'svelte';
	import { authHandler } from '$lib/wallet/authStateHelpers';
	import { buildTransaction, buildRequest } from '$lib/wallet/txHelpers';

	let privy_oauth_state = $page.url.searchParams.get('privy_oauth_state');
	let privy_oauth_code = $page.url.searchParams.get('privy_oauth_code');

	let privy: Privy | null = $state(null);
	let twitURL = $state('');
	let user = $state(null as PrivyAuthenticatedUser | null);
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
		twitURL = (await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/privy'))!
			.url as string;
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
		const [account] = getAllUserEmbeddedSolanaWallets(user!.user);
		if (account && privy?.embeddedWallet.hasEmbeddedWallet()) {
			address = account.address;
			const provider = await privy.embeddedWallet.getSolanaProvider(
				account,
				account.address,
				'solana-address-verifier'
			);
			const connection = new Connection('http://127.0.0.1:8899');
			const pkey = new PublicKey(address);

			const { tx, message } = await buildTransaction.sendOneLamportToSelf(connection, address);
			// const simpleSig = (
			// 	await provider.request({
			// 		method: 'signMessage',
			// 		params: { message }
			// 	})
			// ).signature;
			// tx.addSignature(pkey, Uint8Array.from(Buffer.from(simpleSig, 'base64')));
			// // sign that message ^^^ and attach the signature
			await buildRequest(provider, tx, message, address);
			const confirmedSentTx = await connection.sendTransaction(tx);
			confirmedTx = confirmedSentTx;
		} else {
			embeddedWallet = (await privy?.embeddedWallet.createSolana())!.provider;
		}
	}
</script>

<p>userid: {user?.user.id}</p>
<p>address:{address}</p>
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
	<iframe
		bind:this={iframe}
		src={iframeSrc}
		style="width: 0; height: 0; border: none;"
		title="Privy embedded wallet"
	>
	</iframe>
</div>
