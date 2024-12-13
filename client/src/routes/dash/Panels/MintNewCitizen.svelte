<p class="text-light text-4xl">Recruit</p>
<p class="font-light">
	Recruit a citizen to join your efforts. Purchase a job listing to get a citizen on retainer.
</p>

<p class="mb-2 mt-8 text-xl">Purchase a job listing to recruit a citizen:</p>

<div class="flex w-full flex-col gap-2 sm:flex-row sm:items-center">
	<div class="flex gap-2">
		<button class="rounded-lg bg-background px-4 py-2 transition-all hover:bg-black"> + </button>
		<button class="rounded-lg bg-background px-4 py-2 transition-all hover:bg-black"> - </button>
	</div>
	<p>Recruit</p>
	<input
		type="number"
		value="1"
		class="max-w-[4rem] rounded-xl bg-background p-1 text-center text-lg"
	/>
	<p>citizen for</p>
	<div class="flex items-center gap-2">
		<input
			type="number"
			value="0.25"
			disabled
			class="max-w-[5rem] rounded-xl bg-background p-1 text-center text-lg"
		/>
		<p>SOL</p>
	</div>
</div>
<button
	class="mt-4 w-full rounded-xl border-2 border-black bg-background p-2 transition-all hover:bg-black"
>
	Prepare purchase
</button>
