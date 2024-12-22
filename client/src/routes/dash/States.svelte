<script>
	import * as Table from '$lib/components/ui/table';
	import TipOperations from './Tooltips/TipOperations.svelte';
	import { api } from '$lib/services/apiClient';

	import { createQuery } from '@tanstack/svelte-query';
	const query = createQuery({
		queryKey: ['states'],
		queryFn: api.fetch.getNations
	});

	$inspect('data', $query?.data);
</script>

<div class="grid min-h-[500px] place-items-center rounded-xl bg-panel text-foreground">
	<Table.Root>
		<Table.Caption class="py-2">view all nations</Table.Caption>
		<Table.Header>
			<Table.Row>
				<Table.Head>COIN</Table.Head>
				<Table.Head class="text-right">COIN/SOL</Table.Head>
				<Table.Head class="text-right">Amount</Table.Head>
				<Table.Head class="text-right">SOL</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell>x</Table.Cell>
				<Table.Cell class="text-right">{'x'}</Table.Cell>
				<Table.Cell class="text-right">{'x'}</Table.Cell>
				<Table.Cell class="text-right">{'x'}</Table.Cell>
			</Table.Row>
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
