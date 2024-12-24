<script lang="ts">
	import TipOperations from './Tooltips/TipOperations.svelte';
	import { cn } from '$lib/utils.js';
	import { getCountryFlag } from '$lib/constants/flags';
	import { getNationName } from '$lib/utilsNation';
	import HyperText from '$lib/components/atoms/HyperText/HyperText.svelte';
	import { IconSolana } from '$lib/components/atoms/icons';

	let activeOperationId = $state<string | null>(null);
	let hashBountyClaim = $state<string | null>(null); // TODO: turn this into localStorage to avoid losing claims

	function toggleActiveOp(opId: string) {
		hashBountyClaim = null;
		if (opId === activeOperationId) {
			activeOperationId = null;
			return;
		}
		activeOperationId = opId;
	}

	/**
  DEBUG TOOLS: REMOVE ME WHEN IMPLEMENTING
  */
	$effect(() => {
		// active operation is successfull after X SECONDS
		if (activeOperationId) {
			// const SECONDS = Math.floor(Math.random() * 10) + 2; //random number between 2 and 10
			const SECONDS = 1;
			setTimeout(() => {
				hashBountyClaim = 'foobar';
			}, SECONDS * 1000);
		}
	});
</script>

<div class="flex flex-wrap justify-between gap-2">
	<p class="mb-0 text-xl">Incoming Operation Requests</p>
	<TipOperations />
</div>

<div class={cn('text-yellow-600 opacity-0 transition-all', !!activeOperationId && 'opacity-100')}>
	<p>Closing or refreshing this tab will void progress/claimable bounties.</p>
</div>

{#snippet operation({
	opId: operationId,
	reward = 0.05,
	nationId,
	...props
}: {
	reward: number;
	opId: string;
	title: string;
	nationId: number;
	desc?: string;
})}
	{@const isActive = activeOperationId === operationId}
	<div class="flex flex-col rounded-xl bg-panel p-2 text-xl font-thin text-foreground">
		<div class="flex justify-between">
			<p class="font-medium">{props.title}</p>
			<div
				class={cn(
					'h-5 w-5 rounded-full border-4 border-background bg-background transition-all',
					isActive && !hashBountyClaim && 'animate-pulse bg-blue-400',
					isActive && !!hashBountyClaim && 'animate-pulse bg-green-400'
				)}
			></div>
		</div>

		<div class="mt-2 flex items-center gap-2 rounded-t bg-background p-2">
			<span>
				{getCountryFlag(nationId)}
			</span>
			<span class="text-sm">
				{getNationName(nationId)}
			</span>
		</div>
		<div class="bg-black p-2 text-xs">
			<p>{props.desc}</p>
		</div>
		<div class="flex items-center justify-between rounded-b bg-background p-2 text-xs">
			<p>Bounty</p>
			<div
				class={cn(
					'flex items-center gap-1 text-sm',
					isActive && !hashBountyClaim && 'animate-bounce',
					isActive && !!hashBountyClaim && 'animate-ping'
				)}
			>
				<span>{reward}</span>
				<IconSolana />
			</div>
		</div>
		{#if isActive && !!hashBountyClaim}
			<div class="flex flex-grow flex-col items-end justify-end">
				<button
					onclick={() => toggleActiveOp(operationId)}
					class="hover:shadow-hoverflat rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-background shadow-flat transition-all hover:translate-x-[3px] hover:translate-y-[3px]"
					>Claim Bounty</button
				>
			</div>
		{:else if isActive}
			<div class="flex flex-grow items-end justify-between px-2 text-sm">
				<HyperText
					textLength={28}
					intervalTime={3000}
					texts={[
						'ACCESS GRANTED TO MAINFRAME',
						'DECODING ENCRYPTED PAYLOAD',
						'BREACH DETECTED: INITIATE TRACE',
						'OVERRIDING SECURITY PROTOCOL',
						'FIREWALL PENETRATION SUCCESS',
						'ESTABLISHING CONNECTION',
						'DOWNLOAD COMPLETE: FILE-X',
						'UPLOADING MALWARE PACKAGE',
						'PASSWORD CRACK SUCCESSFUL'
					]}
				/>
				<button
					onclick={() => toggleActiveOp(operationId)}
					class="rounded bg-background px-3 py-1 transition-all hover:scale-110 active:scale-105"
				>
					X
				</button>
			</div>
		{:else}
			<div class="flex flex-grow items-end justify-end">
				<button
					onclick={() => toggleActiveOp(operationId)}
					class="rounded-full bg-black px-4 py-2 text-sm opacity-25 transition-all hover:opacity-100 active:bg-blue-600"
				>
					Attempt
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div
	class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] grid-rows-[repeat(4,230px)] gap-2 md:grid-cols-[repeat(auto-fit,minmax(300px,350px))]"
>
	{@render operation({
		opId: '1',
		reward: 0.01,
		title: 'Disrupt Comms',
		nationId: 5,
		desc: 'Bring down satellite comm systems from China.'
	})}

	{@render operation({
		opId: '2',
		reward: 0.07,
		title: 'Steal AI Research',
		nationId: 100,
		desc: 'Steal classified AI research from the Labs of Nuvora, a pharma giant.'
	})}
</div>
