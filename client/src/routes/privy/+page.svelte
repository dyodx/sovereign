<script lang="ts">
	import Privy, { LocalStorage } from '@privy-io/js-sdk-core';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let privy: Privy | null = $state(null);
	let twitterAuth: '';

	onMount(async () => {
		const newPrivy = new Privy({
			appId: 'cm4rluhru04zmuj8pzs0hklmk',
			storage: new LocalStorage()
		});
		privy = newPrivy;

		const twitttt = await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/privy');
		console.log({ twitttt });
		twitterAuth = twitttt.url;

		console.log({ privy });
	});
</script>

<div>
	<!-- {privy?.embeddedWallet?.getURL()} -->

	<!-- {privy?.auth.oauth.generateURL('twitter', 'https://localhost:5173/auth/twitter/callback')} -->
	{#await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/privy') then url}
		{url?.url}

		<a href={url?.url}>
			<button> login </button>
		</a>
	{/await}
</div>
