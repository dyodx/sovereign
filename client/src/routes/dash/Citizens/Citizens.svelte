<script lang="ts">
	import ModalCitizen from '../Modals/ModalCitizen.svelte';
	import ModalRecruit from '../Modals/ModalRecruit.svelte';
	import { flags } from './constants';

	import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
	import { mplCore, fetchAssetsByOwner, type AssetV1 } from '@metaplex-foundation/mpl-core';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { PUBLIC_RPC_URL } from '$env/static/public';
	import { generateNamePair } from '$lib/constants/names';
	import { publicKey } from '@metaplex-foundation/umi';

	let address = $derived.by(() =>
		$walletStore.connected && !!$walletStore.address ? $walletStore.address : null
	);

	// prepare umi to fetch assets
	const umi = createUmi(PUBLIC_RPC_URL).use(mplCore());
	let assetsPromise: Promise<AssetV1[] | null> | null = $state(null);

	// call loadAllAssets on address change
	$effect(() => {
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
		console.log({ citizens: data, address });
		return data;
	}
</script>

<div class="grid items-end gap-6 md:grid-cols-3">
	<div class="justify-self-center md:justify-self-end">
		<ModalRecruit numberOfCitizens={1}>
			<div>
				<div
					class="w-fit rounded-xl border-2 border-black bg-background px-4 py-2 transition-all hover:bg-panel"
				>
					Purchase 1 citizen for 0.25 SOL
				</div>
			</div>
		</ModalRecruit>
	</div>
	<p class="text-center text-4xl md:text-start">My Citizens</p>
	<button onclick={loadAllAssets}> refresh </button>
</div>
<div></div>

<div class="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
	{#await assetsPromise then data}
		{#each data ?? [] as asset}
			<ModalCitizen citizenId={asset.publicKey}>
				<div class="grid w-fit grid-cols-[8rem_1fr] gap-4 justify-self-center rounded bg-panel">
					<div class="relative flex items-center gap-4">
						<p class="absolute left-[-1rem] top-[-1rem] z-10 text-4xl">
							{flags[20 % flags.length]}
						</p>
						<img
							src={`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${asset.publicKey}`}
							alt="avatar"
							class="h-[3rem] translate-x-[-2px] scale-150 rounded-full border-2 border-panel"
						/>
						<p class="py-1 text-start">
							{generateNamePair(asset.publicKey).firstName.substring(0, 8)}<br />
							{generateNamePair(asset.publicKey).lastName.substring(0, 7)}
						</p>
					</div>
					<div
						class="grid w-full grid-cols-2 items-center justify-items-center overflow-hidden rounded-r-[inherit] text-center text-sm font-thin"
					>
						<p class="h-full w-full bg-red-900 p-1">87</p>
						<p class="h-full w-full bg-green-900 p-1">87</p>
						<p class="h-full w-full bg-blue-900 p-1">87</p>
						<p class="h-full w-full bg-violet-900 p-1">87</p>
					</div>
				</div>
			</ModalCitizen>
		{/each}
	{/await}
</div>
