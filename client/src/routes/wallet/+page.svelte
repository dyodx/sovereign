<script lang="ts">
	import { onMount } from 'svelte';
	import {
		walletStore,
		createWalletAdapters,
		connectWallet,
		disconnectWallet
	} from '$lib/wallet/walletStore';
	import { sendPayment, getWalletBalance } from '$lib/wallet/transactionHelpers';
	import type { Adapter } from '@solana/wallet-adapter-base';

	let walletAdapters: Adapter[] = [];
	let connection: ReturnType<typeof createWalletAdapters>['connection'] | null = null;

	let recipientAddress = '';
	let amount = 0;
	let walletBalance = 0;
	let transactionResult: Awaited<ReturnType<typeof sendPayment>> | null = null;

	$: {
		if (connection && $walletStore.connected && $walletStore.publicKey) {
			getWalletBalance(connection, $walletStore.publicKey)
				.then((balance) => {
					walletBalance = balance;
				})
				.catch((error) => {
					console.error('Failed to fetch wallet balance:', error);
				});
		}
	}

	// NOTE: I think the on mount is preventing the getWalletBalance from working
	// find a way to to make it refresh again?
	onMount(async () => {
		const { adapters, connection: conn } = createWalletAdapters();
		walletAdapters = adapters;
		connection = conn;

		// Fetch wallet balance if connected
		if ($walletStore.connected && $walletStore.publicKey) {
			walletBalance = await getWalletBalance(connection, $walletStore.publicKey);
		}
	});

	function handleWalletConnect() {
		if (walletAdapters.length > 0) {
			connectWallet(walletAdapters[0]); // Connect first adapter (Phantom in this case)
		}
	}

	async function handleSendPayment() {
		if (!$walletStore.connected) {
			alert('Please connect wallet first');
			return;
		}

		if (connection === null) {
			transactionResult = {
				success: false,
				error: 'no connection'
			};
			return;
		}

		try {
			const result = await sendPayment(connection, $walletStore.wallet, recipientAddress, amount);

			transactionResult = result;
		} catch (error) {
			transactionResult = {
				success: false,
				error: 'Unknown error'
			};
		}
	}
</script>

{#if $walletStore.connected}
	<div>
		<p>Wallet Connected: {$walletStore?.publicKey?.toBase58()}</p>
		<button on:click={() => disconnectWallet($walletStore.wallet)}> Disconnect Wallet </button>
	</div>
{:else}
	<button on:click={handleWalletConnect}> Connect Wallet </button>
{/if}

{#if $walletStore.connected}
	<div>
		<h2>Send SOL Payment</h2>
		<p>Your Balance: {walletBalance.toFixed(4)} SOL</p>

		<input type="text" bind:value={recipientAddress} placeholder="Recipient Solana Address" />

		<input type="number" bind:value={amount} placeholder="Amount in SOL" step="0.001" min="0" />

		<button on:click={handleSendPayment}> Send Payment </button>

		{#if transactionResult}
			{#if transactionResult.success}
				<p>
					Transaction Successful! Signature: {transactionResult.signature}
				</p>
			{:else}
				<p>
					Transaction Failed: {transactionResult.error}
				</p>
			{/if}
		{/if}
	</div>
{:else}
	<p>Please connect your wallet first</p>
{/if}
