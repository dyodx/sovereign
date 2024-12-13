<script lang="ts">
	import Body from './Body.svelte';
	import News from './News.svelte';
</script>

<div
	class="grid h-screen w-screen sm:grid-cols-[2fr_1fr] sm:grid-rows-[5rem_1fr] sm:overflow-x-hidden"
>
	<div class="flex items-center border-b-8 border-r-8 border-b-panel border-r-panel px-4">
		<p class="text-4xl font-bold text-panel">SOVEREIGN</p>
	</div>
	<div class="hidden items-center justify-center border-b-8 border-b-panel sm:flex">
		<p class=" text-4xl font-bold text-panel">NEWS</p>
	</div>

	<div class="border-r-8 border-r-panel sm:h-[calc(100vh-5rem)]">
		<Body />
	</div>
	<div class="hidden w-full flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 sm:flex">
		<News />
	</div>
</div>
