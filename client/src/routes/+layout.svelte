<script lang="ts">
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { updateQueryStore } from '$lib/stores/query.svelte';

	//@ts-expect-error: compiler fails to see this dependency
	import { pwaInfo } from 'virtual:pwa-info';
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	const queryClient = new QueryClient();
	updateQueryStore(queryClient);

	let { children } = $props();
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
