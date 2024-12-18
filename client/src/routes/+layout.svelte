<script lang="ts">
	import { getAppKit, APPKIT_KEY } from '$lib/wallet/appkit';
	import { onMount, setContext } from 'svelte';
	import '../app.css';

	//@ts-expect-error: compiler fails to see this dependency
	import { pwaInfo } from 'virtual:pwa-info';
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();

	// Wallet initialization
	onMount(() => {
		const appKitInstance = getAppKit();
		if (appKitInstance) {
			setContext(APPKIT_KEY, appKitInstance);
		}
	});
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
