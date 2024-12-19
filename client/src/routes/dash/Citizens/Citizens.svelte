<script lang="ts">
	import { IconExchange } from '$lib/components/atoms/icons';
	import IconGavel from '$lib/components/atoms/icons/IconGavel.svelte';
	import IconLeaf from '$lib/components/atoms/icons/IconLeaf.svelte';
	import IconMoneyBag from '$lib/components/atoms/icons/IconMoneyBag.svelte';
	import IconStethoscope from '$lib/components/atoms/icons/IconStethoscope.svelte';
	import ModalCitizen from '../Modals/ModalCitizen.svelte';
	import ModalRecruit from '../Modals/ModalRecruit.svelte';

	const flags = [
		'🇦🇺', // Australia
		'🇧🇷', // Brazil
		'🇨🇦', // Canada
		'🇨🇳', // China
		'🇫🇷', // France
		'🇩🇪', // Germany
		'🇮🇳', // India
		'🇮🇹', // Italy
		'🇯🇵', // Japan
		'🇲🇽', // Mexico
		'🇳🇱', // Netherlands
		'🇳🇴', // Norway
		'🇷🇺', // Russia
		'🇪🇸', // Spain
		'🇸🇪', // Sweden
		'🇨🇭', // Switzerland
		'🇹🇷', // Turkey
		'🇬🇧', // United Kingdom
		'🇺🇸', // United States
		'🇰🇷' // South Korea
	];
</script>

<div class="grid items-end gap-6 md:grid-cols-3">
	<div class="justify-self-center md:justify-self-end">
		<ModalRecruit numberOfCitizens={1}>
			<div
				class="w-fit rounded-xl border-2 border-black bg-background px-4 py-2 transition-all hover:bg-panel"
			>
				Purchase 1 citizen for 0.25 SOL
			</div>
		</ModalRecruit>
	</div>
	<p class="text-center text-4xl md:text-start">My Citizens</p>
</div>

<div class="mt-8 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
	{#each Array.from({ length: 30 }).map((_, i) => i) as slotNumber}
		<ModalCitizen citizenId={slotNumber}>
			<div class="grid w-fit grid-cols-[8rem_1fr] gap-4 justify-self-center rounded bg-panel">
				<div class="relative flex items-center gap-4">
					<p class="absolute left-[-1rem] top-[-1rem] z-10 text-4xl">
						{flags[slotNumber % flags.length]}
					</p>
					<img
						src={`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${slotNumber}`}
						alt="avatar"
						class="h-[3rem] translate-x-[-2px] scale-150 rounded-full border-2 border-panel"
					/>
					<p class="py-1 text-start">John<br />Hatchet</p>
				</div>
				<div
					class="grid w-full grid-cols-2 items-center justify-items-center overflow-hidden rounded-r-[inherit] text-center text-sm font-thin"
				>
					<p class="h-full w-full bg-red-900 p-1">87</p>
					<p class="h-full w-full bg-green-900 p-1">87</p>
					<p class="h-full w-full bg-blue-900 p-1">87</p>
					<p class="h-full w-full bg-violet-900 p-1">87</p>

					<!-- {#if slotNumber % 4 === 0} -->
					<!-- 	<IconMoneyBag /> -->
					<!-- {:else if slotNumber % 4 === 1} -->
					<!-- 	<IconStethoscope /> -->
					<!-- {:else if slotNumber % 4 === 2} -->
					<!-- 	<IconGavel /> -->
					<!-- {:else if slotNumber % 4 === 3} -->
					<!-- 	<IconLeaf /> -->
					<!-- {/if} -->

					<!-- <div class="h-4 w-4 rounded-full bg-background"></div> -->
					<!-- <div class="h-4 w-4 rounded-full bg-background"></div> -->
					<!-- <div class="h-4 w-4 rounded-full bg-background"></div> -->
				</div>
			</div>
		</ModalCitizen>
	{/each}
</div>
