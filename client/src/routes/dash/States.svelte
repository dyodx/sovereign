<script lang="ts">
	import { cn } from '$lib/utils.js';
	import * as Table from '$lib/components/ui/table';
	import TipOperations from './Tooltips/TipOperations.svelte';
	import { type NationDTO } from '$lib/services/apiClient';
	import { NATION_STATES } from '$lib/constants/nations';
	import { IconGavel, IconLeaf, IconMoneyBag, IconStethoscope } from '$lib/components/atoms/icons';
	import { queries } from '$lib/services/queries';

	/**
  operations show up without any user input
  - fetching operations will be rest endpoint
  - submitting successfully found hash will be a transaction

  <nationState> wants you to sabotage <citizen> working for <nation>. <explain hashing in fun way>

  one action button to start hashing (add loading spinner)
  clicking on another action button will stop the first (modal to confirm?)
  */

	const nationStates = queries.getNations();

	type Category = 'environment' | 'gdp' | 'healthcare' | 'stability';
	type SortingDirection = 'asc' | 'desc';
	let sortingCategory = $state<Category | ''>('');
	function setSortingCategory(category: Category) {
		if (sortingCategory === category) {
			sortingCategory = '';
			sortingDirection = 'desc';
			return;
		}
		sortingCategory = category;
		sortingDirection = 'desc';
	}

	let sortingDirection = $state<SortingDirection>('desc');
	function toggleSortingDirection() {
		let newDirection: SortingDirection = sortingDirection === 'asc' ? 'desc' : 'asc';
		sortingDirection = newDirection;
	}

	let chev = $derived(sortingDirection === 'asc' ? '▲' : '▼');

	let searchInput = $state('');
	function filterBySearchInput(nation: NationDTO) {
		return NATION_STATES[nation.nationId].toLowerCase().includes(searchInput.toLowerCase());
	}

	function sortNationsByCategory(a: NationDTO, b: NationDTO) {
		if (!a || !b) return 0;
		if (sortingCategory === '') return 0;
		if (sortingCategory === 'environment') {
			return sortingDirection === 'asc'
				? +a.environment - +b.environment
				: +b.environment - +a.environment;
		} else if (sortingCategory === 'gdp') {
			return sortingDirection === 'asc' ? +a.gdp - +b.gdp : +b.gdp - +a.gdp;
		} else if (sortingCategory === 'healthcare') {
			return sortingDirection === 'asc'
				? +a.healthcare - +b.healthcare
				: +b.healthcare - +a.healthcare;
		} else if (sortingCategory === 'stability') {
			return sortingDirection === 'asc' ? +a.stability - +b.stability : +b.stability - +a.stability;
		}
		return 0;
	}
</script>

<div class="relative h-[60vh] overflow-auto rounded-xl bg-panel text-foreground md:h-[70vh]">
	<div class="bg-foreground px-3 py-2 text-background">
		<input
			bind:value={searchInput}
			type="text"
			placeholder="Search Nations"
			class="w-full rounded-xl bg-panel px-4 py-2 text-foreground"
		/>
	</div>

	{#snippet tableHead(category: Category)}
		<div class="relative w-fit">
			{#if sortingCategory === category}
				<button
					class="absolute right-[-1rem] top-1 transition-all hover:scale-110 active:scale-100"
					onclick={toggleSortingDirection}
				>
					{chev}
				</button>
			{/if}
			<button
				onclick={() => setSortingCategory(category)}
				class={cn(
					'rounded bg-foreground px-1 transition-all hover:scale-110 active:scale-105',
					sortingCategory === category ? 'text-black' : 'text-panel',
					sortingCategory === category
						? sortingDirection === 'asc'
							? 'bg-red-200'
							: 'bg-green-200'
						: ''
				)}
			>
				{#if category === 'environment'}
					<IconLeaf />
				{:else if category === 'gdp'}
					<IconMoneyBag />
				{:else if category === 'healthcare'}
					<IconStethoscope />
				{:else if category === 'stability'}
					<IconGavel />
				{/if}
			</button>
		</div>
	{/snippet}

	<Table.Root class="relative ">
		<Table.Caption class="py-2">view all nations</Table.Caption>
		<Table.Header class="sticky top-0 z-10 bg-foreground shadow-black">
			<Table.Row class="text-center text-xs">
				<Table.Head class="text-start text-lg">Nation</Table.Head>
				<Table.Head>{@render tableHead('environment')}</Table.Head>
				<Table.Head>{@render tableHead('gdp')}</Table.Head>
				<Table.Head>{@render tableHead('healthcare')}</Table.Head>
				<Table.Head>{@render tableHead('stability')}</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $nationStates?.data
				?.filter(filterBySearchInput)
				?.sort(sortNationsByCategory) ?? [] as nation}
				<Table.Row class="text-center text-xs md:text-start">
					<Table.Cell class="text-start text-sm">
						<p
							title={NATION_STATES[nation.nationId]}
							class="line-clamp-1 flex w-fit tracking-tighter"
						>
							{`${
								NATION_STATES[nation.nationId].substring(0, searchInput === '' ? 10 : 100).trim() +
								(NATION_STATES[nation.nationId].length > (searchInput === '' ? 10 : 100)
									? '...'
									: '')
							}`}
						</p>
					</Table.Cell>
					<Table.Cell>{(+nation.environment / 1000).toFixed(1)}k</Table.Cell>
					<Table.Cell>{(+nation.gdp / 1000).toFixed(1)}k</Table.Cell>
					<Table.Cell>{(+nation.healthcare / 1000).toFixed(1)}k</Table.Cell>
					<Table.Cell>{(+nation.stability / 1000).toFixed(1)}k</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>

<hr class="my-4 rounded border-2 border-panel" />
<div class="flex flex-wrap justify-between gap-2">
	<p class="mb-0 text-xl">Incoming Operation Requests</p>
	<TipOperations />
</div>

<div class="grid grid-cols-2 grid-rows-[repeat(4,200px)] gap-2">
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
</div>
