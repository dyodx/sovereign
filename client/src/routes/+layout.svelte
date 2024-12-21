<script lang="ts">
	import '../app.css';

	//@ts-expect-error: compiler fails to see this dependency
	import { pwaInfo } from 'virtual:pwa-info';
	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	let { children } = $props();
</script>

<svelte:head>
	{@html webManifestLink}
</svelte:head>

{@render children()}
