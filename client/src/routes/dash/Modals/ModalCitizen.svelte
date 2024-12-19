<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';
	import { currencies } from '$lib/constants/currencies';

	let { citizenId, children } = $props();

	let selectedCurrency: string = $state('');
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Stake your Citizen</Dialog.Title>
			<Dialog.Description>
				<div class="flex flex-col gap-4">
					<p>citizenId: {citizenId}</p>

					<div class="grid grid-cols-2 items-start gap-4">
						<div class="flex w-full flex-col gap-4">
							<Combobox options={currencies} bind:value={selectedCurrency} />

							{#if selectedCurrency !== ''}
								<p>
									{`$${selectedCurrency}`} balance:
									{6}
								</p>
							{/if}
						</div>

						<div class="flex min-h-20 flex-col items-center justify-center rounded-xl bg-panel p-4">
							{#if selectedCurrency !== ''}
								<p class="text-xl font-bold">{10} {`$${selectedCurrency}`}</p>
								<p class="font-thin">/per day</p>
							{/if}
						</div>
					</div>

					<button
						class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black"
					>
						Stake for
						{selectedCurrency === '' ? '...' : `$${selectedCurrency}`}
					</button>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
