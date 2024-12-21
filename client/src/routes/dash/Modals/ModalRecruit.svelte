<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { buildRequest, buildTransaction } from '$lib/wallet/txHelpers';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { privyStore } from '$lib/stores/privy.svelte';
	import { Connection } from '@solana/web3.js';
	import Privy from '@privy-io/js-sdk-core';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';

	let { numberOfCitizens = 1, children } = $props();

	let address = $derived.by(() => $walletStore.address ?? null);

	$inspect('recruit modal address:', address);
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
		await buildRequest(provider, tx, message, address);
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
			<Dialog.Title>Review your Purchase</Dialog.Title>
			<Dialog.Description>
				<div>
					<p>Address: {$walletStore.address}</p>
					<p class="max-w-[300px] overflow-x-auto">Confirm: {confirmedTx}</p>
					<button
						onclick={sendOneLamportToSelf}
						class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black"
					>
						Purchase
					</button>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
