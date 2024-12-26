<script lang="ts">
	import ModalCitizen from '../Modals/ModalCitizen.svelte';
	import ModalRecruit from '../Modals/ModalRecruit.svelte';

	import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
	import {
		mplCore,
		fetchAssetsByOwner,
		type AssetV1,
		freezeAsset
	} from '@metaplex-foundation/mpl-core';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { generateNamePair } from '$lib/constants/names';
	import { getCountryFlag } from '$lib/constants/flags';
	import { GAME_ID } from '$lib/wallet/constants';
	import { CITIZEN_IMG_URL } from '$lib/constants/citizens';
	import { IconGavel, IconLeaf, IconMoneyBag, IconStethoscope } from '$lib/components/atoms/icons';
	import IconRefresh from '$lib/components/atoms/icons/IconRefresh.svelte';
	import { getNationName } from '$lib/utilsNation';

	let address = $derived.by(() =>
		$walletStore.connected && !!$walletStore.address ? $walletStore.address : null
	);

	// prepare umi to fetch assets
	const umi = createUmi(PUBLIC_RPC_URL, { commitment: 'confirmed' }).use(mplCore());
	let assetsPromise: Promise<AssetV1[] | null> | null = $state(null);

	// call loadAllAssets on address change
	$effect(() => {
		// TODO: add a store object that is incremented when you mint a citizen
		// that should update and retrigger this effect to load again
		if (address) {
			loadAllAssets();
		}
	});

	// assign promise to assetsPromise
	async function loadAllAssets() {
		assetsPromise = getAllAssets();
	}

	// fetch all assets from umi
	async function getAllAssets() {
		if (!address) {
			console.error('GetAllAssets: address not set');
			return null;
		}

		let data = await fetchAssetsByOwner(umi, address);
		return data;
	}

	type CitizenAttribute =
		| 'game'
		| 'nation_state'
		| 'gdp_fix'
		| 'healthcare_fix'
		| 'environment_fix'
		| 'stability_fix';
	// CITIZEN HELPERS
	function getAttribute(key: CitizenAttribute, asset: AssetV1) {
		return asset.attributes?.attributeList.find((e) => e.key === key)?.value;
	}
	// Only show citizens that are in current game
	function matchesGameId(asset: AssetV1) {
		return getAttribute('game', asset) === GAME_ID.toString();
	}
	function convertToPercentage(num: string | undefined) {
		if (!num) return 0;
		return Math.round(1 + (+num / 255) * 99);
	}
</script>

<div class="grid items-center justify-items-center gap-6 md:grid-cols-3">
	<div class="justify-self-center md:justify-self-end">
		<ModalRecruit>
			<div>
				<div
					class="w-fit rounded-xl border-2 border-black bg-background px-4 py-2 transition-all hover:bg-panel"
				>
					Recruit Citizen
				</div>
			</div>
		</ModalRecruit>
	</div>
	<div class="flex flex-col items-center">
		<p class="text-center text-4xl md:text-start">Citizens</p>
		<span class="min-h-10">
			{#await assetsPromise then data}
				{data?.filter(matchesGameId).length ?? 0} in wallet
			{/await}
		</span>
	</div>
	<div class="group flex items-center gap-2">
		<span class="select-none"> Refresh </span>
		<button class="transition-all sm:group-hover:animate-spin" onclick={loadAllAssets}>
			<IconRefresh />
		</button>
	</div>
</div>

<div class="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
	{#await assetsPromise then data}
		{#each data?.filter(matchesGameId) ?? [] as asset}
			<ModalCitizen citizenId={asset.publicKey}>
				<div class="grid w-fit grid-cols-[8rem_1fr] gap-4 justify-self-center rounded bg-panel">
					<div class="relative flex items-center gap-4">
						{#if asset.freezeDelegate?.frozen}
							<!-- TODO: Update flag with staked country flag -->
							{@const TEMP_NATION_ID = 10}
							<p class="absolute left-[-1rem] top-[-1rem] z-10 text-4xl">
								<!-- {getCountryFlag(getAttribute('nation_state', asset) ?? 'Solana')} -->
								{getCountryFlag(getNationName(TEMP_NATION_ID))}
							</p>
						{/if}

						<img
							src={`${CITIZEN_IMG_URL}${asset.publicKey}`}
							alt="avatar"
							class="h-[3rem] translate-x-[-2px] scale-150 rounded-full border-2 border-panel"
						/>
						<p class="py-1 text-start">
							{generateNamePair(asset.publicKey).firstName.substring(0, 8)}<br />
							{generateNamePair(asset.publicKey).lastName.substring(0, 7)}
						</p>
					</div>
					<div
						class="grid w-full grid-cols-1 grid-rows-[repeat(4,15px)] items-center justify-items-center overflow-hidden rounded-r-[inherit] text-center text-sm font-thin"
					>
						{#snippet stat(key: CitizenAttribute)}
							<div class=" grid grid-cols-[10px_1fr] gap-x-2">
								<span class="translate-y-[-1.5px] scale-50 rounded-full text-black">
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
								<div class="h-full w-6 border-l-[1px] border-l-background bg-panel">
									<div
										class={`h-full border-r-[1px] border-r-foreground bg-black`}
										style={`width: ${convertToPercentage(getAttribute(key, asset))}%`}
									></div>
								</div>
							</div>
						{/snippet}

						{@render stat('environment_fix')}
						{@render stat('gdp_fix')}
						{@render stat('healthcare_fix')}
						{@render stat('stability_fix')}
					</div>
				</div>
			</ModalCitizen>
		{/each}
	{/await}
</div>
