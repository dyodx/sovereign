<script lang="ts">
	import { onMount } from 'svelte';

	export let texts: string[] = ['hacking main frame', 'CYBER', 'SYNTH']; // Array of texts to rotate through
	export let speed: number = 50; // Speed of the randomization in milliseconds
	export let intervalTime: number = 1000; // Time between each text rotation in milliseconds
	export let textLength: number = 100000; // length of the text (substring)

	let displayText: string = '';
	let currentIndex: number = 0;
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	function randomChar(): string {
		return characters[Math.floor(Math.random() * characters.length)];
	}

	function hackerEffect(targetText: string, callback?: () => void): void {
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

	function startAnimation(): void {
		hackerEffect(texts[currentIndex], () => {
			currentIndex = (currentIndex + 1) % texts.length;
			setTimeout(startAnimation, intervalTime);
		});
	}

	onMount(() => {
		startAnimation();
	});
</script>

<div class="hacker-text">{displayText.substring(0, textLength)}</div>

<style>
	.hacker-text {
		font-family: monospace;
		white-space: nowrap;
		overflow: hidden;
	}
</style>
