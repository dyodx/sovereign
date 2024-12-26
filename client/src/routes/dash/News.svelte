<script lang="ts">
	let tweet = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;
</script>

{#each Array.from({ length: 8 }).map((_, i) => i) as slotNumber}
	<div class="flex w-full flex-col rounded-xl bg-panel p-4 text-2xl text-background">
		<div class="flex items-start justify-between">
			<div class="flex items-center gap-2">
				<div class="h-10 w-10 rounded-full bg-background"></div>
				<p class="text-foreground">#USA</p>
			</div>
			<a href="#twitterUrl">
				<p class="text-sm text-foreground hover:underline">12 hrs ago</p>
			</a>
		</div>

		<p class="text-[1rem] leading-6 text-foreground">
			{tweet.substring(0, 250)}
		</p>
	</div>
{/each}
