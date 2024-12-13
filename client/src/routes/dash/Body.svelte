<script>
	import Citizens from './Citizens/Citizens.svelte';
</script>

<div class="flex h-full flex-col gap-8">
	<div class="flex flex-col gap-4 p-4">
		<div class="shadow-flat flex flex-col gap-2 rounded-xl border-2 border-black bg-panel p-4">
			<div class="flex justify-between">
				<p class="text-light text-4xl">Citizens</p>
				<div class="flex gap-[-10px]">
					{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
						<div
							class="ml-[-1rem] h-10 w-10 overflow-hidden rounded-full border-2 border-panel bg-foreground"
						>
							<img
								src={`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${slotNumber}`}
								alt="avatar"
							/>
						</div>
					{/each}
				</div>
			</div>
			<p class="font-light">
				Hire professionals to join your efforts. Each citizen starts with 1 skill. Once hired, you
				can contract out citizens to nations for cash. Or task a citizen on research, for them to
				learn more skills.
			</p>
		</div>

		<div
			class="shadow-flat w-fit min-w-[300px] gap-2 rounded-xl border-2 border-black bg-panel p-4"
		>
			<p>(mint new citizen)</p>
		</div>
	</div>

	<div class="h-[400px] flex-grow overflow-y-auto border-t-8 border-t-panel bg-black p-8">
		<Citizens />
	</div>
</div>
