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
	import { CITIZEN_IMG_URL } from '$lib/constants/citizens';
	import { onMount } from 'svelte';
	import { Confetti } from 'svelte-confetti';

	let { children } = $props();

	const connection = new Connection(PUBLIC_RPC_URL as string, { commitment: 'confirmed' }); // todo figure out how make this everywhere

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
		console.info('CONFIRMED SENT TX:', confirmedSentTx);
		confirmedTx = confirmedSentTx;
	}

	let seed = $state(1);
	onMount(() => {
		const interval = setInterval(() => {
			seed++;
		}, 1000);

		// Clean up interval when component unmounts
		return () => clearInterval(interval);
	});
</script>

<!--PANEL: IF ADDRESS AND TWITTER LINKED -->
{#snippet mint()}
	<div class="relative grid h-[200px] place-items-center rounded-xl bg-panel">
		{#key seed}
			<img
				src={`${CITIZEN_IMG_URL}${seed}`}
				alt="citizen"
				class="h-20 w-20 animate-bounce rounded-full border-2 border-black duration-1000"
			/>
			<!-- PRELOAD THE NEXT IMAGE -->
			<img src={`${CITIZEN_IMG_URL}${seed + 1}`} alt="citizen" class="hidden" />
		{/key}

		<!-- COST TO MINT -->
		<div class="absolute bottom-0 flex w-full items-center justify-center py-2">
			{#await getMintCost() then mintCost}
				<IconSolana />
				<p class="text-xl font-bold">{mintCost}</p>
			{/await}
		</div>
	</div>

	<!-- PURCHASE BUTTON -->
	<button
		onclick={mintNewCitizen}
		class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black disabled:opacity-75"
	>
		{#if confirmedTx === ''}
			Purchase
		{:else}
			Purchase another
		{/if}
	</button>

	<!-- TX HASH -->
	{#if confirmedTx !== ''}
		{#key confirmedTx}
			<div class="absolute left-[50%] top-[40%] z-50 flex">
				<Confetti x={[-0.5, 0.5]} y={[-0.5, 0.5]} />
			</div>
		{/key}
		<div class="flex items-center justify-between pt-2">
			<button
				onclick={() => copyToClipboard(confirmedTx)}
				class="max-w-[300px] overflow-x-auto underline"
				>Copy Tx Hash: {confirmedTx.substring(0, 6)}...</button
			>
			<span> Wait ~10s to refresh and see </span>
		</div>
	{/if}
{/snippet}

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Recruit a citizen</Dialog.Title>
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
