<script lang="ts">
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';
	import Combobox from '$lib/components/molecules/Combobox/Combobox.svelte';
	import * as Popover from '$lib/components/ui/popover';
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Swap Coins</p>
	<TipCitizensExplained />
</div>

<div class="flex flex-col items-center py-4">
	<Combobox></Combobox>
	<div class="flex">
		<input class="rounded-xl bg-background p-1 text-center text-lg" />
		<!-- <input class="max-w-20 rounded-xl bg-background p-1 text-center text-lg" /> -->
	</div>
	<div class="z-50 my-[-0.5rem] h-8 w-8 rounded-lg border-4 border-panel bg-background"></div>
	<input class="rounded-xl bg-background p-1 text-center text-lg" />
</div>
