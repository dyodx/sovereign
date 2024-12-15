<script lang="ts">
	import { onMount } from 'svelte';
	import {
		walletStore,
		createWalletAdapters,
		connectWallet,
		disconnectWallet
	} from '$lib/wallet/walletStore';

	let walletAdapters = [];
	let connection = null;

	onMount(() => {
		const { adapters, connection: conn } = createWalletAdapters();
		walletAdapters = adapters;
		connection = conn;
	});

	function handleWalletConnect() {
		if (walletAdapters.length > 0) {
			connectWallet(walletAdapters[0]); // Connect first adapter (Phantom in this case)
		}
	}
</script>

{#if $walletStore.connected}
	<div>
		<p>Wallet Connected: {$walletStore.publicKey.toBase58()}</p>
		<button on:click={() => disconnectWallet($walletStore.wallet)}> Disconnect Wallet </button>
	</div>
{:else}
	<button on:click={handleWalletConnect}> Connect Wallet </button>
{/if}
