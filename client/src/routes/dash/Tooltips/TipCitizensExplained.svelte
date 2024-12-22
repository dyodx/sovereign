<script lang="ts">
	import Tooltip from '$lib/components/molecules/Tooltip/Tooltip.svelte';
	import { CITIZEN_IMG_URL } from '$lib/constants/citizens';
</script>

<Tooltip title="Citizens">
	<div class="flex flex-col items-center sm:flex-row">
		<div class="ml-4 flex gap-[-10px]">
			{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
				<div
					class="ml-[-1rem] h-10 w-10 overflow-hidden rounded-full border-2 border-panel bg-foreground"
				>
					<img src={`${CITIZEN_IMG_URL}${slotNumber}`} alt="avatar" />
				</div>
			{/each}
		</div>
	</div>
	<p class="mt-4 text-left font-light">
		Hire professionals to join your efforts. Each citizen starts with 1 skill. Once hired, you can
		contract out citizens to nations for cash. Or task a citizen on research, for them to learn more
		skills.
	</p>
</Tooltip>
