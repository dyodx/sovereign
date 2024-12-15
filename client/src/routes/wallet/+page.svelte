<script lang="ts">
	import { onMount } from 'svelte';
	import {
		walletStore,
		createWalletAdapters,
		connectWallet,
		disconnectWallet
	} from '$lib/wallet/walletStore';
	import { sendPayment, getWalletBalance } from '$lib/wallet/transactionHelpers';

	let walletAdapters = [];
	let connection = null;

	let recipientAddress = '';
	let amount = 0;
	let walletBalance = 0;
	let transactionResult = null;

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

		try {
			const result = await sendPayment(connection, $walletStore.wallet, recipientAddress, amount);

			transactionResult = result;
		} catch (error) {
			transactionResult = {
				success: false,
				error: error.message
			};
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
