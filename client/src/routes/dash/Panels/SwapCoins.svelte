<script lang="ts">
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';

	const options = [
		{
			value: 'sveltekit',
			label: 'SvelteKit'
		},
		{
			value: 'next.js',
			label: 'Next.js'
		},
		{
			value: 'nuxt.js',
			label: 'Nuxt.js'
		},
		{
			value: 'remix',
			label: 'Remix'
		},
		{
			value: 'astro',
			label: 'Astro'
		}
	];

	let value = $state('');
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Swap Coins</p>
	<TipCitizensExplained />
</div>

<div class="flex flex-col py-4">
	<p>Sell</p>
	<div class="flex gap-4">
		<input class="rounded-xl bg-background p-1 text-center text-lg" {value} />
		<Combobox {options} bind:value />
	</div>
	<!-- <div class="z-50 my-[-0.5rem] h-8 w-8 self-start rounded-lg border-4 border-panel bg-background" ></div> -->
	<div class="relative mt-3 flex justify-center">
		<div class="absolute top-[50%] h-[1px] w-full bg-background"></div>
		<p class="z-10 bg-panel px-2 text-background">trade</p>
	</div>
	<p>Buy</p>
	<div class="flex gap-4">
		<input class="rounded-xl bg-background p-1 text-center text-lg" {value} />
		<Combobox {options} bind:value />
	</div>
</div>
