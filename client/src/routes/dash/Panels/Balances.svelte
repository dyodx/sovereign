<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';

	let data = [
		{
			ticker: 'USA',
			balance: 1000,
			perSol: 0.0025
		}
	];
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Balances</p>
	<TipCitizensExplained />
</div>

<Table.Root>
	<Table.Caption class="py-2">view all coins</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>COIN</Table.Head>
			<Table.Head class="text-right">Per SOL</Table.Head>
			<Table.Head class="text-right">Amount</Table.Head>
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each data as { ticker, balance, perSol }}
			<Table.Row>
				<Table.Cell>
					{ticker}
				</Table.Cell>
				<Table.Cell class="text-right">{perSol}</Table.Cell>
				<Table.Cell class="text-right">{balance}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
