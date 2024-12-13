<script lang="ts">
	import Body from './Body.svelte';
</script>

<div class="grid h-screen w-screen grid-cols-[2fr_1fr] grid-rows-[5rem_1fr]">
	<div class="border-b-8 border-r-8 border-b-panel border-r-panel"></div>
	<div class="border-b-8 border-b-panel"></div>

	<div class="border-r-8 border-r-panel">
		<Body />
	</div>
	<div class="">news</div>
</div>
