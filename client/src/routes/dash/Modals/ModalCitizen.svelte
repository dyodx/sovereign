<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';
	import { getCountryFlag } from '$lib/constants/flags';
	import { fetchAssetV1, mplCore, type AssetV1 } from '@metaplex-foundation/mpl-core';
	import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { generateNamePair } from '$lib/constants/names';
	import IconCopy from '$lib/components/atoms/icons/IconCopy.svelte';
	import { CITIZEN_IMG_URL } from '$lib/constants/citizens';
	import { IconGavel, IconLeaf, IconMoneyBag, IconStethoscope } from '$lib/components/atoms/icons';
	import { NATION_STATES as _NATION_STATES } from '$lib/constants/nations';
	import { copyToClipboard } from '$lib/utils';
	import { queries } from '$lib/services/queries';
	import type { NationDTO } from '$lib/services/apiClient';

	const nationStates = queries.getNations();

	const [_SOLANA, ...NATION_STATES] = _NATION_STATES;

	let { citizenId, children } = $props();
	const { firstName, lastName } = generateNamePair(citizenId);

	const umi = createUmi(PUBLIC_RPC_URL).use(mplCore());
	const asset = fetchAssetV1(umi, citizenId);

	let selectedNation: string = $state('');
	let stateCurrencyBalance = $state(0);

	type CitizenAttribute =
		| 'game'
		| 'nation_state'
		| 'gdp_fix'
		| 'healthcare_fix'
		| 'environment_fix'
		| 'stability_fix';

	function getAttribute(key: CitizenAttribute, asset: AssetV1) {
		return asset.attributes?.attributeList.find((e) => e.key === key)?.value;
	}
	function getNationId(nationName: string) {
		return NATION_STATES.findIndex((e) => e === nationName);
	}
	function getNationData() {
		if (!selectedNation) return null;
		const nation = $nationStates.data?.find((e) => {
			return e.nationId === getNationId(selectedNation);
		});
		return nation;
	}

	function getRewardForStake(citizen: AssetV1) {
		const { gdpRewardRate, stabilityRewardRate, healthcareRewardRate, environmentRewardRate } =
			getNationData() as NationDTO;

		const environment = getAttribute('environment_fix', citizen) as string;
		const gdp = getAttribute('gdp_fix', citizen) as string;
		const healthcare = getAttribute('healthcare_fix', citizen) as string;
		const stability = getAttribute('stability_fix', citizen) as string;

		const rewards = [
			+environment * +environmentRewardRate,
			+gdp * +gdpRewardRate,
			+healthcare * +healthcareRewardRate,
			+stability * +stabilityRewardRate
		];

		return {
			rewards,
			total: rewards.reduce((a, b) => a + b, 0)
		};
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
				<div class="mt-2 flex flex-col gap-4">
					{#await asset then citizen}
						<div class="flex items-center gap-2 rounded bg-panel p-2">
							<img
								src={`${CITIZEN_IMG_URL}${citizenId}`}
								alt="avatar"
								class="h-[1.5rem] translate-x-[-2px] scale-150 rounded border-2 border-panel"
							/>
							<p>{firstName} {lastName}</p>
							<button
								class="group flex flex-grow cursor-pointer items-end justify-end gap-2 text-background"
								onclick={() => copyToClipboard(citizenId)}
							>
								<p>
									{`${citizenId.substring(0, 6)}...${citizenId.substring(citizenId.length - 6, citizenId.length)}`}
								</p>
								<span class="transition-all group-hover:scale-125 group-active:scale-110">
									<IconCopy />
								</span>
							</button>
						</div>
						<p class="rounded bg-panel p-2">
							Citizen of: <span class="group-hover:scale-125"
								>{getCountryFlag(getAttribute('nation_state', citizen) ?? 'Solana')}</span
							>
							{getAttribute('nation_state', citizen)}
						</p>

						<div class="grid grid-cols-2 gap-2">
							{#snippet stat(key: CitizenAttribute, text: string)}
								<div>
									<p class="text-xs">{text}</p>
									<div
										class="flex min-h-10 items-center justify-center gap-2 rounded bg-panel text-lg"
									>
										<span class="rounded-full text-background">
											{#if key === 'environment_fix'}
												<IconLeaf />
											{:else if key === 'gdp_fix'}
												<IconMoneyBag />
											{:else if key === 'healthcare_fix'}
												<IconStethoscope />
											{:else if key === 'stability_fix'}
												<IconGavel />
											{:else}
												{' '}
											{/if}
										</span>
										<p>{getAttribute(key, citizen)}</p>
									</div>
								</div>
							{/snippet}

							{@render stat('environment_fix', 'ENVIRONMENT: ')}
							{@render stat('gdp_fix', 'GDP:')}
							{@render stat('healthcare_fix', 'HEALTH:')}
							{@render stat('stability_fix', 'STABILITY:')}
						</div>
					{/await}
					<div></div>

					<div class="grid grid-cols-2 items-start gap-4">
						<div class="flex w-full flex-col gap-4">
							<Combobox
								options={NATION_STATES.map((e, i) => ({ value: e, label: e }))}
								bind:value={selectedNation}
							/>

							{#if selectedNation !== ''}
								<div class="flex justify-center">
									<p>Current Balance: ${stateCurrencyBalance}</p>
								</div>
							{/if}
						</div>

						<div class="flex min-h-20 flex-col items-center justify-center rounded-xl bg-panel p-4">
							{#await asset then citizen}
								{#if selectedNation !== ''}
									{#key selectedNation}
										<p class="text-xl font-bold">{getRewardForStake(citizen).total}</p>
									{/key}
									<p class="font-bold">
										{`$${selectedNation.replace(/\b(?:and|of|the|Democratic)\b|\s+|'/gi, '')}`}
									</p>
									<p class="font-thin">/per day</p>
								{/if}
							{/await}
						</div>
					</div>

					<button
						class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black"
					>
						Stake for
						{selectedNation === '' ? '...' : `$${selectedNation}`}
					</button>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
