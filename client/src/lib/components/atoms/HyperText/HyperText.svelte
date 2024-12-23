<script>
	import { onMount } from 'svelte';

	export let text = 'HACKER';
	export let speed = 50; // Speed of the randomization in milliseconds

	let displayText = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	function randomChar() {
		return characters[Math.floor(Math.random() * characters.length)];
	}

	function hackerEffect(targetText, callback) {
		const length = targetText.length;
		let currentText = Array(length).fill('');
		let completed = Array(length).fill(false);

		const interval = setInterval(() => {
			let done = true;

			for (let i = 0; i < length; i++) {
				if (!completed[i]) {
					currentText[i] = randomChar();
					done = false;
				}
			}

			const nextText = targetText.split('');
			for (let i = 0; i < length; i++) {
				if (Math.random() < 0.2 && !completed[i]) {
					currentText[i] = nextText[i];
					completed[i] = true;
				}
			}

			displayText = currentText.join('');

			if (done) {
				clearInterval(interval);
				if (callback) callback();
			}
		}, speed);
	}

	onMount(() => {
		hackerEffect(text);
	});
</script>

<div class="hacker-text">{displayText}</div>

<style>
	.hacker-text {
		font-family: monospace;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
