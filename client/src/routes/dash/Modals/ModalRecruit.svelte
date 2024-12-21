<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Table from '$lib/components/ui/table';

	let { numberOfCitizens = 1, children } = $props();
	let pricePerCitizen = 0.25;
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Review your Purchase</Dialog.Title>
			<Dialog.Description>
				<div>
					<!-- TABLE -->
					<Table.Root>
						<Table.Caption class="rounded bg-blue-100 p-2">
							Do you wish to purchase {numberOfCitizens} citizen(s) NFTs <br />for {pricePerCitizen *
								numberOfCitizens} SOL?
						</Table.Caption>
						<Table.Header>
							<Table.Row>
								<Table.Head></Table.Head>
								<Table.Head></Table.Head>
								<Table.Head class="text-right">Amount</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each Array.from({ length: numberOfCitizens }).map((_, i) => i) as citizenNumber}
								<Table.Row>
									<Table.Cell>
										<div class="h-8 w-8 rounded-full bg-white"></div>
									</Table.Cell>
									<Table.Cell>
										<p>Citizen: 1 random skill</p>
									</Table.Cell>
									<Table.Cell class="text-right">{pricePerCitizen} SOL</Table.Cell>
								</Table.Row>
							{/each}

							{#if numberOfCitizens > 1}
								<Table.Row class="bg-black">
									<Table.Cell></Table.Cell>
									<Table.Cell>
										<p>{numberOfCitizens} Citizens</p>
									</Table.Cell>
									<Table.Cell class="text-right"
										>{pricePerCitizen * numberOfCitizens} SOL</Table.Cell
									>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
					<!-- TABLE -->
					<button
						class="mt-4 w-full rounded-xl border-2 border-black bg-black p-2 transition-all hover:bg-black"
					>
						Purchase
					</button>
				</div>
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
