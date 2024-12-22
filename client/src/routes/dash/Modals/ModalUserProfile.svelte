<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { copyToClipboard } from '$lib/utils';
	import { buildRequest, buildTransaction } from '$lib/wallet/txHelpers';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { privyStore } from '$lib/stores/privy.svelte';
	import { Connection, PublicKey } from '@solana/web3.js';
	import Privy from '@privy-io/js-sdk-core';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { getPlayerAccount } from '$lib/wallet/txUtilities';
	import { IconCopy, IconTwitter } from '$lib/components/atoms/icons';
	import IconSolana from '$lib/components/atoms/icons/IconSolana.svelte';

	let { numberOfCitizens = 1, children } = $props();

	const connection = new Connection(PUBLIC_RPC_URL as string); // todo figure out how make this everywhere

	let address = $derived.by(() => $walletStore.address ?? null);

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

	async function createEmbeddedWallet() {
		await walletHandler.createEmbeddedWallet({
			privy: privy as Privy,
			user: user as PrivyAuthenticatedUser,
			setProvider: (e) => (provider = e)
		});
	}

	async function sendOneLamportToSelf() {
		if (!provider) {
			console.error('no provider');
			await createEmbeddedWallet();
			sendOneLamportToSelf();
			return;
		}
		if (!address || address === '')
			return console.error('Sending Lamport Error: no address:', address);
		const connection = new Connection(PUBLIC_RPC_URL as string);
		const { tx, message } = await buildTransaction.sendOneLamportToSelf(connection, address);
		const signed = await buildRequest(provider, message, address);

		const pkey = new PublicKey(address);
		tx.addSignature(pkey, Uint8Array.from(Buffer.from(signed, 'base64')));

		const confirmedSentTx = await connection.sendTransaction(tx);
		confirmedTx = confirmedSentTx;
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

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Profile</Dialog.Title>
			<Dialog.Description>
				<div>
					{#if !address}
						<p>Please connect your wallet</p>
					{:else}
						{#snippet copy()}
							<span
								class="justify-self-center transition-all group-hover:scale-125 group-active:scale-110"
							>
								<IconCopy />
							</span>
						{/snippet}
						<div class="flex flex-col gap-4">
							<button
								class="group grid grid-cols-[1fr_1fr_8fr] items-center gap-2 rounded-xl bg-panel p-2"
								onclick={() => copyToClipboard(address)}
							>
								{@render copy()}
								<span><IconSolana /></span>
								<span class="overflow-x-auto">{address}</span>
							</button>

							{#await getPlayerAccount(address) then data}
								<button
									class="group grid grid-cols-[1fr_1fr_8fr] items-center gap-2 rounded-xl bg-panel p-2"
									onclick={() =>
										copyToClipboard(data?.Account?.xUsername ?? 'Not linked', { isAddress: false })}
								>
									{@render copy()}
									<span> <IconTwitter /> </span>
									<span class="justify-self-start">
										{data?.Account?.xUsername ?? 'No twitter account linked'}
									</span>
								</button>
							{/await}
						</div>
					{/if}
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
