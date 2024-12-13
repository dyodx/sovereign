<div class="flex items-end gap-6">
	<p class="text-4xl">My Citizens</p>
	<div class="grid grid-cols-[1.25rem_1fr] items-center gap-x-1 text-sm font-thin text-panel">
		<div class="h-4 w-4 rounded bg-green-600"></div>
		<p>Available to work</p>
		<div class="h-4 w-4 rounded bg-orange-600"></div>
		<p>Unavailable to work</p>
	</div>
</div>

<div class="mt-8 grid grid-cols-[repeat(auto-fit,minmax(270px,1fr))] gap-y-5">
	{#each Array.from({ length: 30 }).map((_, i) => i) as slotNumber}
		<div class="grid w-fit grid-cols-[1.5rem_8rem_1fr] rounded-lg bg-panel pr-8">
			<div class="rounded-l-lg bg-green-400"></div>

			<div class="flex items-center gap-4">
				<img
					src={`https://api.dicebear.com/9.x/lorelei-neutral/svg?seed=${slotNumber}`}
					alt="avatar"
					class="h-[3rem] translate-x-[-2px] scale-150 rounded-full border-2 border-panel"
				/>
				<p class="py-1">John<br />Hatchet</p>
			</div>
			<div class="ml-8 grid grid-cols-3 items-center gap-x-2">
				<div class="h-4 w-4 rounded-full bg-black"></div>
				<div class="h-4 w-4 rounded-full bg-black"></div>
				<div class="h-4 w-4 rounded-full bg-black"></div>
				<div class="h-4 w-4 rounded-full bg-black"></div>
				<div class="h-4 w-4 rounded-full bg-black"></div>
				<div class="h-4 w-4 rounded-full bg-black"></div>
			</div>
		</div>
	{/each}
</div>
