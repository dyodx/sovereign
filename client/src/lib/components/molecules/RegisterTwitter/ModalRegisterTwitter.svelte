<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	import { buildRequest, buildTransaction } from '$lib/wallet/txHelpers';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { privyStore } from '$lib/stores/privy.svelte';
	import { Connection, PublicKey } from '@solana/web3.js';
	import Privy from '@privy-io/js-sdk-core';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { getPlayerAccount } from '$lib/wallet/txUtilities';
	import IconTwitter from '$lib/components/atoms/icons/IconTwitter.svelte';

	let { children } = $props();

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
	let linkedTwitterHandle = $state('');
	$effect(() => {
		let handle = user?.user?.linked_accounts?.find(
			(account) => account.type === 'twitter_oauth'
		)?.username;
		if (handle) {
			linkedTwitterHandle = handle;
		}
	});

	async function createEmbeddedWallet() {
		await walletHandler.createEmbeddedWallet({
			privy: privy as Privy,
			user: user as PrivyAuthenticatedUser,
			setProvider: (e) => (provider = e)
		});
	}

	async function registerXAccount() {
		if (!linkedTwitterHandle)
			return console.error('Register X: no twitter handle:', linkedTwitterHandle);

		if (!provider) {
			console.error('no provider: creating and trying again');
			await createEmbeddedWallet();
			registerXAccount();
			return;
		}
		if (!address || address === '') return console.error('Register X: no address:', address);

		const { tx, message } = await buildTransaction.registerPlayer(
			connection,
			address,
			linkedTwitterHandle
		);
		const pkey = new PublicKey(address);
		const signed = await buildRequest(provider, message, address);
		tx.addSignature(pkey, Uint8Array.from(Buffer.from(signed, 'base64')));

		const confirmedSentTx = await connection.sendTransaction(tx);
		confirmedTx = confirmedSentTx;
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={`${confirmedTx === '' ? 'w-full' : 'hidden'}`}>
		{#if confirmedTx === ''}
			{@render children?.()}
		{/if}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">Link your <IconTwitter /> Account</Dialog.Title>
			<Dialog.Description>
				<div class="flex flex-col gap-4">
					<p>
						Register your X account with the game to receive rewards for interaction with the nation
						state ai on X.
					</p>
					<p class="rounded-lg bg-panel p-4">@{linkedTwitterHandle}</p>

					<button
						class="rounded-xl bg-black p-4 text-white transition-all hover:scale-105 active:scale-100"
						onclick={registerXAccount}
					>
						register @{linkedTwitterHandle}
					</button>

					{#if !!confirmedTx && confirmedTx !== ''}
						<div class="w-full max-w-[350px] overflow-x-auto">
							<p>Confirmation Tx:</p>
							<a
								href={`https://explorer.solana.com/tx/${confirmedTx}`}
								target="_blank"
								rel="noreferrer"
							>
								<p class="underline">{confirmedTx}</p>
							</a>
						</div>
					{/if}
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
