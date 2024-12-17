<script>
	import Citizens from './Citizens/Citizens.svelte';
	import MintNewCitizen from './Panels/MintNewCitizen.svelte';
</script>

<div class="flex h-full flex-col gap-8">
	<div class="flex flex-col gap-4 p-4">
		<div class=" gap-2 rounded-xl border-2 border-black bg-panel p-4 shadow-flat sm:max-w-[70%]">
			<MintNewCitizen />
		</div>
	</div>

	<div class="flex-grow border-t-8 border-t-panel bg-black p-8 sm:h-[100%] sm:overflow-y-auto">
		<Citizens />
	</div>
</div>
