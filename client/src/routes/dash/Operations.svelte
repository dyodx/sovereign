<script lang="ts">
	import TipOperations from './Tooltips/TipOperations.svelte';
	import { cn } from '$lib/utils.js';
	import { getCountryFlag } from '$lib/constants/flags';
	import { getNationName } from '$lib/utilsNation';
	import HyperText from '$lib/components/atoms/HyperText/HyperText.svelte';
</script>

<div class="flex flex-wrap justify-between gap-2">
	<p class="mb-0 text-xl">Incoming Operation Requests</p>
	<TipOperations />
</div>

{#snippet operation(title: string, nationId: number, desc: string = '', isActive = false)}
	<div class="flex flex-col rounded-xl bg-panel p-2 text-xl font-thin text-foreground">
		<div class="flex justify-between">
			<p class="font-light">{title}</p>
			<div
				class={cn(
					'h-5 w-5 rounded-full border-4 border-background ',
					isActive ? 'animate-pulse bg-green-400' : 'bg-background'
				)}
			></div>
		</div>

		<div class="mt-2 flex items-center gap-2 rounded-t bg-background p-2">
			<span>
				{getCountryFlag(nationId)}
			</span>
			<span class="text-sm">
				{getNationName(nationId)}
			</span>
		</div>
		<div class="rounded-b bg-black p-2 text-xs">
			<p>{desc}</p>
		</div>
		{#if isActive}
			<HyperText text="Hacking" />
		{:else}
			<div class="flex flex-grow items-end">
				<button class="rounded-full bg-black px-4 py-2"> Attempt </button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="grid grid-cols-2 grid-rows-[repeat(4,200px)] gap-2">
	{@render operation(
		'Steal AI Research',
		5,
		'Steal classified AI research from the Labs of Nuvora, a pharma giant.'
	)}

	{@render operation(
		'Steal AI Research',
		7,
		'Steal classified AI research from the Labs of Nuvora, a pharma giant.',
		true
	)}
</div>
