<script lang="ts">
	import Body from './Body.svelte';
	import News from './News.svelte';
</script>

<div class="grid h-screen w-screen grid-cols-[2fr_1fr] grid-rows-[5rem_1fr] overflow-x-hidden">
	<div class="flex items-center border-b-8 border-r-8 border-b-panel border-r-panel px-4">
		<p class="text-4xl font-bold text-panel">SOVEREIGN</p>
	</div>
	<div class="flex items-center justify-center border-b-8 border-b-panel">
		<p class=" text-4xl font-bold text-panel">NEWS</p>
	</div>

	<div class="border-r-8 border-r-panel">
		<Body />
	</div>
	<div class="flex w-full flex-col gap-4 overflow-y-auto overflow-x-hidden p-4">
		<News />
	</div>
</div>
