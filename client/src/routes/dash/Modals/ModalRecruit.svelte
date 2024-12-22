<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { buildRequest, buildTransaction } from '$lib/wallet/txHelpers';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { privyStore } from '$lib/stores/privy.svelte';
	import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
	import Privy from '@privy-io/js-sdk-core';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { getGameAccount, getPlayerAccount } from '$lib/wallet/txUtilities';
	import IconSolana from '$lib/components/atoms/icons/IconSolana.svelte';
	import { copyToClipboard } from '$lib/utils';

	let { numberOfCitizens = 1, children } = $props();

	const connection = new Connection(PUBLIC_RPC_URL as string); // todo figure out how make this everywhere

	let address = $derived.by(() => $walletStore.address ?? null);
	let playerAccountPromise: ReturnType<typeof getPlayerAccount> | null = $state(null);
	$effect(() => {
		if (!address) return;
		playerAccountPromise = getPlayerAccount(address);
	});

	let privy: Privy | null = $derived.by(() =>
		$privyStore.isInitialized ? $privyStore.privy : null
	);

	let user: PrivyAuthenticatedUser | null = $derived.by(() =>
		$privyStore.isInitialized ? $privyStore.user : null
	);
	let provider = $state(
		null as Awaited<ReturnType<Privy['embeddedWallet']['getSolanaProvider']>> | null
	);

	let confirmedTx = $state('');

	async function getMintCost() {
		const { getGameMetaData } = getGameAccount();
		const gameMetaData = await getGameMetaData();
		const mintCost = gameMetaData.mintCost / LAMPORTS_PER_SOL;
		return mintCost;
	}

	async function createEmbeddedWallet() {
		await walletHandler.createEmbeddedWallet({
			privy: privy as Privy,
			user: user as PrivyAuthenticatedUser,
			setProvider: (e) => (provider = e)
		});
	}

	async function mintNewCitizen() {
		if (!provider) {
			console.error('no provider, trying again');
			await createEmbeddedWallet();
			mintNewCitizen();
			return;
		}
		if (!address || address === '')
			return console.error('Sending Lamport Error: no address:', address);

		const { tx, message } = await buildTransaction.mintNewCitizen(connection, address);
		const pkey = new PublicKey(address);
		const signed = await buildRequest(provider, message, address);
		tx.addSignature(pkey, Uint8Array.from(Buffer.from(signed, 'base64')));

		const confirmedSentTx = await connection.sendTransaction(tx);
		confirmedTx = confirmedSentTx;
	}
</script>

{#snippet mint()}
	<div class="relative h-[200px] rounded-xl bg-panel">
		<div class="absolute bottom-0 flex w-full items-center justify-center py-2">
			{#await getMintCost() then mintCost}
				<IconSolana />
				<p class="text-xl font-bold">{mintCost}</p>
			{/await}
		</div>
	</div>
	<button
		onclick={mintNewCitizen}
		class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black disabled:opacity-75"
	>
		{#if confirmedTx === ''}
			Purchase
		{:else}
			Purchased another
		{/if}
	</button>

	{#if confirmedTx !== ''}
		<button
			onclick={() => copyToClipboard(confirmedTx)}
			class="max-w-[300px] overflow-x-auto pt-2 underline"
			>Copy Tx Hash: {confirmedTx.substring(0, 6)}...</button
		>
	{/if}
{/snippet}

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Pay to recruit a citizen</Dialog.Title>
			<Dialog.Description>
				<div>
					{#if !address}
						<p>Please connect your wallet to recruit citizens</p>
					{:else}
						{#await getPlayerAccount(address) then data}
							{#if !data?.Account?.xUsername}
								<p>You must register your twitter account to recruit citizens</p>
							{:else}
								{@render mint()}
							{/if}
						{/await}
					{/if}
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
