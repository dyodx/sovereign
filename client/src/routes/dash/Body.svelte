<script>
	import Citizens from './Citizens/Citizens.svelte';
	import Panel_Balances from './Panels/Balances.svelte';
	import Panel_MintNewCitizen from './Panels/MintNewCitizen.svelte';
	import Panel_SwapCoins from './Panels/SwapCoins.svelte';
</script>

<div class="flex h-full flex-col gap-8">
	<div class="flex flex-col gap-4 p-4">
		<div class="rounded-xl border-2 border-black bg-panel p-4 shadow-flat sm:max-w-[70%]">
			<Panel_MintNewCitizen />
		</div>
		<div class="rounded-xl border-2 border-black bg-panel p-4 shadow-flat sm:max-w-[70%]">
			<Panel_Balances />
		</div>

		<div class="rounded-xl border-2 border-black bg-panel p-4 shadow-flat sm:max-w-[70%]">
			<Panel_SwapCoins />
		</div>
	</div>

	<div class="flex-grow border-t-8 border-t-panel bg-black p-8 sm:h-[100%] sm:overflow-y-auto">
		<Citizens />
	</div>
</div>
