<script lang="ts">
	import { cn } from '$lib/utils.js';
	import Body from './Body.svelte';
	import News from './News.svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import Privy, { type PrivyEmbeddedSolanaWalletProvider } from '@privy-io/js-sdk-core';
	import type { PrivyAuthenticatedUser } from '@privy-io/public-api';
	import { onMount } from 'svelte';
	import { authHandler } from '$lib/wallet/authStateHelpers';
	import { walletHandler } from '$lib/wallet/walletHelpers';

	import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
	import { mplCore, fetchAssetsByOwner, type AssetV1 } from '@metaplex-foundation/mpl-core';

	// Use the RPC endpoint of your choice.
	const umi = createUmi('http://127.0.0.1:8899').use(mplCore());
	async function getAllAssets() {
		let assets: AssetV1[] | null = $state(null);
		let data = await fetchAssetsByOwner(umi, '8LmYF6q3GvMtT8AbpwrUxrGMiABhNESsb9HKCN649QoQ');
		console.log({ data });
		assets = data;
	}

	let privy: Privy | null = $state(null);
	let user = $state(null as PrivyAuthenticatedUser | null);
	let provider = $state(
		null as Awaited<ReturnType<Privy['embeddedWallet']['getSolanaProvider']>> | null
	);
	let iframeSrc = $state('');
	let iframe = $state(null as HTMLIFrameElement | null);
	let handler: (e: MessageEvent) => void;
	let embeddedWallet = $state(null as PrivyEmbeddedSolanaWalletProvider | null);
	let address = $state('');

	onMount(async () => {
		await authHandler.initializePrivy({
			setUser: (newUser: PrivyAuthenticatedUser | null) => (user = newUser),
			setPrivy: (newPrivy: Privy | null) => (privy = newPrivy),
			setAddress: (newAddress: string | null) => (address = newAddress as string)
		});

		if (privy && embeddedWallet === null && address) {
			walletHandler.createEmbeddedWallet({
				privy: privy as Privy,
				user: user as PrivyAuthenticatedUser,
				setProvider: (e) => (provider = e),
				setEmbeddedWallet: (e) => (embeddedWallet = e)
			});
		}

		iframeSrc = privy?.embeddedWallet.getURL()! as string;
		if (iframe?.contentWindow) {
			privy!.setMessagePoster(iframe.contentWindow as any);
			handler = (e: MessageEvent) => privy!.embeddedWallet.onMessage(e.data);
			window.addEventListener('message', handler);
		}
	});

	async function login() {
		if (!privy) return console.error('privy not initialized');
		let twitterAuthUrl = await authHandler.generateTwitterAuthUrl({
			privy
		});
		window.location = twitterAuthUrl as string & Location;
	}
	function openAccount() {
		// open account modal
	}

	let tab: 'dash' | 'news' | 'state' = $state('dash');
</script>

<iframe
	bind:this={iframe}
	src={iframeSrc}
	style="width: 0; height: 0; border: none;"
	title="Privy embedded wallet"
>
</iframe>

<div
	class="grid h-screen w-screen md:grid-cols-[2fr_1fr] md:grid-rows-[5rem_1fr] md:overflow-x-hidden"
>
	<div
		class="order-last justify-center border-t-8 border-panel border-b-panel px-4 md:order-first md:flex md:justify-between md:border-b-8 md:border-r-8 md:border-t-0"
	>
		<div class="flex items-center">
			<button
				class={cn(
					'hidden text-4xl font-bold md:inline',
					tab === 'dash' ? 'text-foreground' : 'text-panel'
				)}
				onclick={() => {
					tab = 'dash';
				}}
			>
				SOVEREIGN
			</button>
			<span class="hidden text-4xl font-bold text-panel md:ml-2 md:inline"> | </span>
			<button
				class={cn(
					'hidden text-4xl font-bold md:inline',
					tab === 'state' ? 'text-foreground' : 'text-panel'
				)}
				onclick={() => {
					tab = 'state';
				}}
			>
				STATES
			</button>
			<button onclick={getAllAssets}> Test </button>
		</div>
		<div class="flex items-center pt-4 md:pt-0">
			{#if !!address}
				<button onclick={openAccount} class="rounded-xl bg-panel px-4 py-2">
					<div class="group flex items-center gap-4">
						<span class="tracking-tight">
							{address.substring(0, 4)}
							{address.substring(address.length - 4, address.length)}
						</span>
						<img
							class="scale-100 rounded-full bg-background bg-center p-[2px] transition-all group-hover:scale-125"
							src={`https://api.dicebear.com/9.x/identicon/svg?seed=${address}`}
							alt="pfp"
							width="35px"
							height="35px"
						/>
					</div>
				</button>
			{:else}
				<button
					onclick={login}
					class="scale-100 rounded-xl bg-panel px-4 py-2 group-hover:scale-110"
				>
					{#if !privy}
						<p>loading..</p>
					{:else}
						login
					{/if}
				</button>
			{/if}
		</div>

		<!-- MOBILE TABS -->
		<Tabs.Root bind:value={tab} class="w-full py-4 md:hidden">
			<Tabs.List class="justify-self-end">
				<Tabs.Trigger value="dash">Dashboard</Tabs.Trigger>
				<Tabs.Trigger value="news">News</Tabs.Trigger>
				<Tabs.Trigger value="state">States</Tabs.Trigger>
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
		{#if tab === 'dash'}
			<Body></Body>
		{:else if tab === 'news'}
			<div class="flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-4">
				<News></News>
			</div>
		{:else if tab === 'state'}
			<div class="flex w-full flex-col gap-2 overflow-y-auto overflow-x-hidden p-4">
				todo: add state panels
			</div>
		{/if}
	</div>
	<div class="hidden w-full flex-col gap-4 overflow-y-auto overflow-x-hidden p-4 md:flex">
		<News></News>
	</div>
</div>
