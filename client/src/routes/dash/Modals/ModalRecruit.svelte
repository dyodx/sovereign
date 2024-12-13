<script lang="ts">
	let { showModal = $bindable() } = $props();

	let dialog: HTMLDialogElement | undefined = $state(); // HTMLDialogElement

	$effect(() => {
		if (showModal) dialog?.showModal();
	});
</script>

<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={(e) => {
		if (e.target === dialog) dialog.close();
	}}
	class="bg-white p-4"
>
	<div></div>
</dialog>
