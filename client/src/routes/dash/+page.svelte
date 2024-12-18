<script lang="ts">
	import Body from './Body.svelte';
	import News from './News.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let tab: 'body' | 'news' = $state('body');
</script>

<div
	class="grid h-screen w-screen md:grid-cols-[2fr_1fr] md:grid-rows-[5rem_1fr] md:overflow-x-hidden"
>
	<div
		class="order-last items-center border-t-8 border-panel border-b-panel px-4 md:order-first md:flex md:border-b-8 md:border-r-8 md:border-t-0"
	>
		<p class="hidden text-4xl font-bold text-panel md:inline">SOVEREIGN</p>
		<Tabs.Root bind:value={tab} class="w-full py-4 md:hidden">
			<Tabs.List class="justify-self-end">
				<Tabs.Trigger value="body">Dashboard</Tabs.Trigger>
				<Tabs.Trigger value="news">News</Tabs.Trigger>
			</Tabs.List>
		</Tabs.Root>
	</div>
	<div class="hidden items-center justify-center border-b-8 border-b-panel md:flex">
		<p class="text-4xl font-bold text-panel">NEWS</p>
	</div>

	<!-- BOTTOM SECTION -->
	<div
		class={`overflow-y-auto overflow-x-hidden border-r-panel md:h-[calc(100vh-5rem)] md:overflow-x-visible md:border-r-8`}
	>
		{#if tab === 'body'}
			<Body></Body>
		{:else if tab === 'news'}
			<div class="flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-4">
				<News></News>
			</div>
		{/if}
	</div>
	<div class="hidden w-full flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 md:flex">
		<News></News>
	</div>
</div>
