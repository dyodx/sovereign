<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	let { numberOfCitizens = 1, children } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-full">
		{@render children?.()}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
			<Dialog.Description>
				Do you wish to purchase {numberOfCitizens} citizen(s)?
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
