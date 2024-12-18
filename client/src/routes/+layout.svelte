<script lang="ts">
	import { getAppKit, APPKIT_KEY, appKitStore } from '$lib/wallet/appkit.svelte';
	import { onMount } from 'svelte';
	import '../app.css';

	//@ts-expect-error: compiler fails to see this dependency
	import { pwaInfo } from 'virtual:pwa-info';
	import { get } from 'svelte/store';
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
