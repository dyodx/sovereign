<script lang="ts">
	import * as Table from '$lib/components/ui/table';
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';
	import { walletStore } from '$lib/stores/wallet.svelte';

	let balance = $derived.by(() => ($walletStore.connected ? $walletStore.balance : 0));

	let data = [
		{
			ticker: 'USA',
			balance: 1000,
			perSol: 0.0025
		},
		{
			ticker: 'CAN',
			balance: 890,
			perSol: 0.0009
		}
	];
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Balances</p>
	<TipCitizensExplained />
</div>

<p>
	SOL balance: {balance}
</p>

<Table.Root>
	<Table.Caption class="py-2">view all coins</Table.Caption>
	<Table.Header>
		<Table.Row>
			<Table.Head>COIN</Table.Head>
			<Table.Head class="text-right">COIN/SOL</Table.Head>
			<Table.Head class="text-right">Amount</Table.Head>
			<Table.Head class="text-right">SOL</Table.Head>
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
				<Table.Cell class="text-right">{Math.round(balance * perSol * 1000) / 1000}</Table.Cell>
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
