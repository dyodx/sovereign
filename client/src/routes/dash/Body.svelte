<script>
	import Citizens from './Citizens/Citizens.svelte';
	import Panel_Balances from './Panels/Balances.svelte';
	import Panel_SwapCoins from './Panels/SwapCoins.svelte';
</script>

<div class="flex h-full flex-col gap-8">
	<div class="grid grid-cols-[repeat(auto-fit,minmax(360px,1fr))] gap-4 p-2 md:p-4">
		<div class="rounded-xl border-2 border-black bg-panel p-4 shadow-flat">
			<Panel_Balances />
		</div>

		<div class="rounded-xl border-2 border-black bg-panel p-4 shadow-flat">
			<Panel_SwapCoins />
		</div>
	</div>

	<div class="flex-grow border-t-8 border-t-panel bg-black p-8">
		<Citizens />
	</div>
</div>
