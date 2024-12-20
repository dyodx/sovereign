<script lang="ts">
	import { page } from '$app/stores';
	import Privy, { LocalStorage } from '@privy-io/js-sdk-core';
	import { redirect } from '@sveltejs/kit';
	import { onMount } from 'svelte';

	let privy_oauth_state = $page.url.searchParams.get('privy_oauth_state');
	let privy_oauth_provider = $page.url.searchParams.get('privy_oauth_provider');
	let privy_oauth_code = $page.url.searchParams.get('privy_oauth_code');

	let privy: Privy | null = $state(null);
	let twitterAuth: '';

	onMount(async () => {
		const newPrivy = new Privy({
			appId: 'cm4rluhru04zmuj8pzs0hklmk',
			storage: new LocalStorage()
		});
		privy = newPrivy;

		const twitttt = await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/dash');
		console.log({ twitttt });
		twitterAuth = twitttt.url;

		console.log({ privy });
	});
</script>

<div>
	{privy_oauth_code}
	{privy_oauth_state}
	{privy_oauth_provider}
	{#await privy?.auth.oauth.generateURL('twitter', 'http://localhost:5173/privy') then url}
		<a href={url?.url}>
			<button> login </button>
		</a>
	{/await}

	<button
		onclick={async () => {
			const res = (privy as Privy).auth.oauth.loginWithCode(
				privy_oauth_code as string,
				privy_oauth_state as string,
				'twitter'
			);
			res.then((e) => {
				console.log(e);
			});
		}}
	>
		auth
	</button>
</div>
