<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';
	import { currencies } from '$lib/constants/currencies';
	import { getCountryFlag } from '$lib/constants/flags';
	import { fetchAssetV1, mplCore, type AssetV1 } from '@metaplex-foundation/mpl-core';
	import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { generateNamePair } from '$lib/constants/names';

	let { citizenId, children } = $props();
	const { firstName, lastName } = generateNamePair(citizenId);

	// prepare umi to fetch assets
	const umi = createUmi(PUBLIC_RPC_URL).use(mplCore());
	const asset = fetchAssetV1(umi, citizenId);
	console.log({ citizenId, asset });

	let selectedCurrency: string = $state('');

	type CitizenAttributes =
		| 'game'
		| 'nation_state'
		| 'gdp_fix'
		| 'healthcare_fix'
		| 'environment_fix'
		| 'stability_fix';

	function getAttribute(key: CitizenAttributes, asset: AssetV1) {
		return asset.attributes?.attributeList.find((e) => e.key === key)?.value;
	}
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
					{#await asset then data}
						<p>{firstName} {lastName}</p>
						<p>
							Citizen of: {getCountryFlag(getAttribute('nation_state', data) ?? 'Solana')}
							{getAttribute('nation_state', data)}
						</p>
						<div class="grid grid-cols-4">
							<p>GDP: {getAttribute('gdp_fix', data)}</p>
							<p>HEALTH: {getAttribute('healthcare_fix', data)}</p>
							<p>ENVIRONMENT: {getAttribute('environment_fix', data)}</p>
							<p>STABILITY: {getAttribute('stability_fix', data)}</p>
						</div>
					{/await}
					<div></div>

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
