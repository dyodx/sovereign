<script lang="ts">
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';
	import IconExchange from '$lib/components/atoms/icons/IconExchange.svelte';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';
	import { currencies } from '$lib/constants/currencies';

	const options = currencies;

	let sell = $state('');
	let buy = $state('');
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Swap Coins</p>
	<TipCitizensExplained />
</div>

{#snippet trade(direction: 'Sell' | 'Buy')}
	<div class="flex items-end gap-2">
		<Combobox {options} value={direction === 'Sell' ? sell : buy} />
		<div>
			<div class="flex justify-between">
				<p>{direction}</p>
				<p>$0.00</p>
			</div>
			<div class="flex gap-4">
				<input
					type="number"
					class="w-full rounded-xl bg-background p-1 text-lg"
					value={direction === 'Sell' ? sell : buy}
				/>
			</div>
		</div>
	</div>
{/snippet}

<div class="flex flex-col py-4">
	{@render trade('Sell')}
	<div class="relative mt-3 flex justify-center">
		<div
			class="absolute top-[50%] h-[1px] w-full bg-gradient-to-r from-panel via-background to-panel"
		></div>
		<p class="z-10 bg-panel px-2 text-background"><IconExchange /></p>
	</div>
	{@render trade('Buy')}
</div>

<button
	disabled={sell === ''}
	class="w-full rounded-xl border-2 border-black bg-background p-2 transition-all hover:bg-black"
>
	{#if sell === ''}
		Select a token
	{:else}
		Swap {sell}
	{/if}
</button>
