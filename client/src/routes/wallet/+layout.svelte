<script lang="ts">
	import '../../app.css';

	import { onMount } from 'svelte';
	import { clusterApiUrl } from '@solana/web3.js';
	import {
		workSpace,
		WalletProvider,
		WalletMultiButton,
		ConnectionProvider
	} from '@svelte-on-solana/wallet-adapter-ui';

	const localStorageKey = 'walletAdapter';
	const network = clusterApiUrl('devnet'); // localhost or mainnet

	let wallets;

	onMount(async () => {
		const { PhantomWalletAdapter, SolflareWalletAdapter, TorusWalletAdapter } = await import(
			'@solana/wallet-adapter-wallets'
		);

		const walletsMap = [
			new PhantomWalletAdapter(),
			new SolflareWalletAdapter(),
			new TorusWalletAdapter()
		];

		wallets = walletsMap;
	});

	let { children } = $props();
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />

<div>
	<p>yo yo yo</p>
	{@render children()}
</div>

<WalletMultiButton />
