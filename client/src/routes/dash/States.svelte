<script>
	import TipOperations from './Tooltips/TipOperations.svelte';
</script>

<div class="grid min-h-[500px] place-items-center rounded-xl bg-panel text-foreground">
	nation table stats
</div>
<hr class="my-4 rounded border-2 border-panel" />
<div class="flex flex-wrap justify-between gap-2">
	<p class="mb-0 text-xl">Incoming Operation Requests</p>
	<TipOperations />
</div>
<div class="grid grid-cols-2 grid-rows-[repeat(4,200px)] gap-2">
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
	<div class="grid place-items-center rounded-xl bg-panel text-xl text-background">operation</div>
</div>
