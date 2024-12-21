<script lang="ts">
	import { tick } from 'svelte';
	import { IconChevUpDown } from '$lib/components/atoms/icons';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		defaultText?: string;
		options: { value: string; label: string }[];
		value: string;
	};
	let { defaultText = 'Select', options, value = $bindable() }: Props = $props();

	let open = $state(false);
	let triggerRef = $state<HTMLButtonElement>(null!);

	const selectedValue = $derived(options.find((f) => f.value === value)?.label);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				class="min-w-28 justify-between bg-background shadow-flat"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				<p>
					{selectedValue || defaultText}
				</p>

				<IconChevUpDown />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[200px] border-0 p-0" data-testid="combobox-content">
		<Command.Root class="bg-background text-foreground">
			<Command.Input placeholder="Search..." />
			<Command.List>
				<Command.Empty>No result found.</Command.Empty>
				<Command.Group>
					{#each options as option}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
