<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	const { title, children } = $props();
</script>

<Dialog.Root>
	<Dialog.Trigger class="w-fit">
		<div class="grid h-6 w-6 place-items-center rounded-full bg-background shadow-flat">
			<p class="text-foreground">?</p>
		</div>
	</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>{title}</Dialog.Title>
			<Dialog.Description>
				{@render children()}
			</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>
