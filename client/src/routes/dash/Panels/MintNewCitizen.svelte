<script lang="ts">
	// @deprecated - removing this panel
	import ModalRecruit from '../Modals/ModalRecruit.svelte';
	import TipCitizensExplained from '../Tooltips/TipCitizensExplained.svelte';
</script>

<div class="flex justify-between">
	<p class="text-light text-2xl md:text-4xl">Recruit a Citizen</p>
	<TipCitizensExplained />
</div>

<div class="my-6 flex w-full flex-wrap items-center gap-2">
	<p>Recruit</p>
	<input
		disabled
		value="1"
		type="number"
		min={1}
		class="max-w-[4rem] rounded-xl bg-background p-1 text-center text-lg"
	/>
	<p class="hidden lg:inline">citizen</p>
	<p>for</p>
	<div class="flex items-center gap-2">
		<input
			type="number"
			value="0.25"
			disabled
			class="max-w-[5rem] rounded-xl bg-background p-1 text-center text-lg"
		/>
		<p>SOL</p>
	</div>
</div>
<ModalRecruit numberOfCitizens={1}>
	<div
		class=" w-full rounded-xl border-2 border-black bg-background p-2 transition-all hover:bg-black"
	>
		Review Purchase
	</div>
</ModalRecruit>
