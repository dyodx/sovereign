<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { copyToClipboard } from '$lib/utils';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { getPlayerAccount } from '$lib/wallet/txUtilities';
	import { IconCopy, IconTwitter } from '$lib/components/atoms/icons';
	import IconSolana from '$lib/components/atoms/icons/IconSolana.svelte';

	let { children } = $props();

	let address = $derived.by(() => $walletStore.address ?? null);
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
								<span class="justify-self-start"
									>{address.substring(0, 10)}...{address.substring(
										address.length - 10,
										address.length
									)}</span
								>
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
