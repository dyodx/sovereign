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
	import type Privy from '@privy-io/js-sdk-core';
	import { privyStore } from '$lib/stores/privy.svelte';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { walletHandler } from '$lib/wallet/walletHelpers';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { PublicKey } from '@solana/web3.js';
	import { buildRequest, buildTransaction } from '$lib/wallet/txHelpers';
	import IconStopwatch from '$lib/components/atoms/icons/IconStopwatch.svelte';

	const nationStates = queries.getNations();
	const [_SOLANA, ...NATION_STATES] = _NATION_STATES;

	let { citizenId, children } = $props();
	const { firstName, lastName } = generateNamePair(citizenId);
	const umi = createUmi(PUBLIC_RPC_URL).use(mplCore());
	const asset = fetchAssetV1(umi, citizenId);

	let selectedNation: string = $state('');
	const currencyRegex = /\b(?:and|of|the|Democratic)\b|\s+|'/gi;

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
		const d = getNationData() as NationDTO;
		if (!d) return { rewards: [], total: 0 };

		const environment = getAttribute('environment_fix', citizen) as string;
		const gdp = getAttribute('gdp_fix', citizen) as string;
		const healthcare = getAttribute('healthcare_fix', citizen) as string;
		const stability = getAttribute('stability_fix', citizen) as string;

		const rewards = [
			+environment * +d.environmentRewardRate,
			+gdp * +d.gdpRewardRate,
			+healthcare * +d.healthcareRewardRate,
			+stability * +d.stabilityRewardRate
		];

		return {
			rewards,
			total: rewards.reduce((a, b) => a + b, 0)
		};
	}

	/**
	 * WALLET ACTIONS - STAKE
	 */
	let address = $derived.by(() => $walletStore.address ?? null);
	let connection = $derived.by(() => $walletStore.connection ?? null);
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

	async function stakeCitizen(): Promise<void> {
		if (!address || address === '')
			return console.error('Sending Lamport Error: no address:', address);
		if (!connection) return console.error('no connection, please try again');
		if (!provider) return createEmbeddedWallet().then((e) => stakeCitizen());

		const pkey = new PublicKey(address);

		const citizen = await asset.catch((e) => console.error('Error fetching citizen:', e));
		if (!citizen) return console.error('No citizen found', { citizenId });

		const totalStakingReward = getRewardForStake(citizen).total;

		console.log('TODO: send transaction');
		return;

		// TODO: Finish building transaction
		const { tx, message } = await buildTransaction.stakeCitizen(connection, address, citizenId);
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
								options={NATION_STATES.map((e) => ({ value: e, label: e }))}
								bind:value={selectedNation}
							/>

							{#if selectedNation !== ''}
								{@const nation = getNationData()}
								{#snippet reward(
									key: keyof Pick<
										NationDTO,
										| 'gdpRewardRate'
										| 'environmentRewardRate'
										| 'healthcareRewardRate'
										| 'stabilityRewardRate'
									>
								)}
									<div class="flex items-center justify-center rounded bg-panel px-1">
										{#if key === 'environmentRewardRate'}
											<IconLeaf />
										{:else if key === 'gdpRewardRate'}
											<IconMoneyBag />
										{:else if key === 'healthcareRewardRate'}
											<IconStethoscope />
										{:else if key === 'stabilityRewardRate'}
											<IconGavel />
										{/if}
										<span>
											x{nation?.[key]}
										</span>
									</div>
								{/snippet}
								<div class="grid grid-cols-2 gap-1">
									{@render reward('environmentRewardRate')}
									{@render reward('gdpRewardRate')}
									{@render reward('healthcareRewardRate')}
									{@render reward('stabilityRewardRate')}
								</div>
							{/if}
						</div>

						<div class="flex min-h-28 flex-col items-center justify-center rounded-xl bg-panel p-4">
							{#await asset then citizen}
								{#if selectedNation !== ''}
									{#key selectedNation}
										<p class="text-xl font-bold">{getRewardForStake(citizen).total}</p>
									{/key}
									<p class="font-bold">
										{`$${selectedNation.replace(currencyRegex, '')}`}
									</p>
									<p class="text-xs font-thin">/per stake (6hrs)</p>
								{/if}
							{/await}
						</div>
					</div>

					<div class="flex items-center gap-2">
						{#if selectedNation !== ''}
							<IconStopwatch />
							<p>6hrs</p>
						{/if}
						<button
							class=" w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:opacity-80 active:opacity-70"
							onclick={stakeCitizen}
						>
							Stake for
							{selectedNation === '' ? '...' : `$${selectedNation.replace(currencyRegex, '')}`}
						</button>
					</div>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
