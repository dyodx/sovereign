<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import TipOperations from './Tooltips/TipOperations.svelte';
	import { api, type NationDTO } from '$lib/services/apiClient';

	import { createQuery } from '@tanstack/svelte-query';
	import { NATION_STATES } from '$lib/constants/nations';
	import { IconGavel, IconLeaf, IconMoneyBag, IconStethoscope } from '$lib/components/atoms/icons';
	const query = createQuery({
		queryKey: ['states'],
		queryFn: api.fetch.getNations
	});

	$inspect('data', $query?.data);

	let searchInput = $state('');
	function filterBySearchInput(nation: NationDTO) {
		return NATION_STATES[nation.nationId].toLowerCase().includes(searchInput.toLowerCase());
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
	<Table.Root class="relative ">
		<Table.Caption class="py-2">view all nations</Table.Caption>
		<Table.Header class="sticky top-0 z-10 bg-foreground shadow-black">
			<Table.Row class="text-center text-xs">
				<Table.Head class="text-start text-lg">Nation</Table.Head>
				<Table.Head><IconLeaf /></Table.Head>
				<Table.Head><IconMoneyBag /></Table.Head>
				<Table.Head><IconStethoscope /></Table.Head>
				<Table.Head><IconGavel /></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $query?.data?.filter(filterBySearchInput) ?? [] as nation}
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
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
</div>
