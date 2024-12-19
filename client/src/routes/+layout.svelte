<script lang="ts">
	import { getAppKit } from '$lib/wallet/appkit.svelte';
	import '../app.css';

	//@ts-expect-error: compiler fails to see this dependency
	import { pwaInfo } from 'virtual:pwa-info';
	import { walletStore } from '$lib/stores/wallet.svelte';
	import { onMount } from 'svelte';
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
