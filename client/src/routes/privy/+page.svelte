<script lang="ts">
	import { page } from '$app/stores';
	import Privy, { getAllUserEmbeddedSolanaWallets, getUserEmbeddedEthereumWallet, getUserEmbeddedSolanaWallet, LocalStorage, type PrivyEmbeddedSolanaWalletProvider } from '@privy-io/js-sdk-core';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
	import { onDestroy, onMount } from 'svelte';

	let privy_oauth_state = $page.url.searchParams.get('privy_oauth_state');
	let privy_oauth_code = $page.url.searchParams.get('privy_oauth_code');

	let privy: Privy | null = $state(null);
	let twitURL = $state("")
	let user = $state(null as PrivyAuthenticatedUser | null)
	let iframeSrc = $state("")
	let iframe = $state(null as HTMLIFrameElement | null);
	let handler: (e: MessageEvent) => void;
	let embeddedWallet = $state(null as PrivyEmbeddedSolanaWalletProvider | null);
	let address = $state("");
	onMount(async () => {
		const newPrivy = new Privy({
			appId: 'cm4rluhru04zmuj8pzs0hklmk',
			storage: new LocalStorage()
		});
		privy = newPrivy;
		iframeSrc = privy?.embeddedWallet.getURL()! as string;
		console.log("iframeSrc", iframeSrc);
		if(iframe?.contentWindow) {
			privy!.setMessagePoster(iframe.contentWindow as any);
			handler = (e: MessageEvent) => privy!.embeddedWallet.onMessage(e.data);
			window.addEventListener('message', handler);
		}
	});

	onDestroy(() => {
		if(typeof window !== 'undefined' && handler) {
			window.removeEventListener('message', handler)
		}
	});

	async function generateURL() {
		twitURL = (await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/privy'))!.url as string;
	}

	async function loginWithCode() {
		privy?.auth.oauth.loginWithCode(
			privy_oauth_code as string,
			privy_oauth_state as string,
			'twitter'
		).then((e) => {
			user = e;
			console.log(user);
		});
	} 

	async function createEmbeddedWallet() {
		if(privy?.embeddedWallet.hasEmbeddedWallet()) {
			const accounts = getAllUserEmbeddedSolanaWallets(user!.user);
			address = accounts[0].address;
			const provider = await privy.embeddedWallet.getSolanaProvider(accounts[0], accounts[0].address, "solana-address-verifier");
			const connection = new Connection("https://api.devnet.solana.com");
			const pkey = new PublicKey(address);
			const transaction = new Transaction()
			transaction.feePayer = pkey;
			transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
			transaction.add(
				SystemProgram.transfer({
					fromPubkey: pkey,
					toPubkey: pkey,
					lamports: 1
				})
			)
			const serializedTransaction = transaction.serialize({requireAllSignatures: false, verifySignatures: false}).toString('base64');
			console.log("trying things");
			const signedTxn = (await provider.request({
				method: "signMessage",
				params: {
					message: serializedTransaction
				}
			})).signature;
			console.log(signedTxn);
			const txnSig = await connection.sendRawTransaction(Uint8Array.from(atob(signedTxn), c => c.charCodeAt(0)));
			console.log(txnSig);

		} else {
			embeddedWallet = (await privy?.embeddedWallet.createSolana())!.provider;
		}

	}
</script>

<div>
	<button onclick={generateURL}> generateURL </button> <br />
	<a href={twitURL}>Go To Twitter {twitURL}</a> <br />
	<button onclick={loginWithCode}> loginWithCode {privy_oauth_state} {privy_oauth_code} </button> <br />
	<button onclick={createEmbeddedWallet}> createEmbeddedWallet {user?.user.id} </button> <br />
	<iframe
	  bind:this={iframe}
	  src={iframeSrc}
	  style="width: 0; height: 0; border: none;"
	  title="Privy embedded wallet"
	>
	</iframe>
</div>
