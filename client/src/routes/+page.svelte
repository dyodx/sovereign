<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let notificationInput: string = '';
	let registration: ServiceWorkerRegistration | null = null;
	let isSubscribed: boolean = false;

	onMount(async () => {
		if (browser && 'serviceWorker' in navigator) {
			try {
				if (!navigator.serviceWorker) return Error('no service worker');
				registration = (await navigator.serviceWorker.getRegistration()) ?? null;
			} catch (error) {
				console.error('Service worker registration error:', error);
			}
		}
	});

	async function requestNotificationPermission() {
		if (!browser) return null;

		if (Notification.permission === 'default') {
			return await Notification.requestPermission();
		}
		return Notification.permission;
	}

	async function showNotification(body: string) {
		if (!browser || !registration) return console.error('not enough', registration);

		console.log('reg', registration);

		const title = 'What PWA Can Do Today';
		const payload = { body };

		if ('showNotification' in registration) {
			console.log('showNotification is there', title, payload);
			setTimeout(async () => {
				console.log('okay showing');
				return await registration?.showNotification(title, payload);
			}, 1000);
		} else {
			console.log('NOPE! showNotification is not there', title, payload);
			new Notification(title, payload);
		}
	}

	async function subscribeToNotifications() {
		if (!browser || !registration) return;

		try {
			const permission = await requestNotificationPermission();

			if (permission === 'granted') {
				// In a real-world scenario, you'd typically use Push API here
				// This is a simplified example
				isSubscribed = true;
				alert('Successfully subscribed to notifications');
			}
		} catch (error) {
			console.error('Subscription error:', error);
			alert('Failed to subscribe to notifications');
		}
	}

	async function sendNotification() {
		if (!browser) return console.error('Browser not supported');

		const permission = await requestNotificationPermission();

		if (permission === 'granted') {
			console.info('granted - showing notification', notificationInput);
			await showNotification(notificationInput);
			navigator.serviceWorker.ready.then((reg) =>
				reg.getNotifications().then((noti) => {
					console.log(noti);
					const msgs = noti.map((n) => n.body);
					// alert(JSON.stringify(msgs));
					console.log(msgs);
				})
			);
		} else if (permission === 'denied') {
			alert('Notification permission was denied');
		}
	}

	function fakeNotification() {
		try {
			new Notification('HI MOM', {
				body: 'YO YO YO'
			});
		} catch (e) {
			console.error('Notification error:', e);
		}
	}

	function checkNotificationPermission() {
		if (Notification.permission === 'granted') {
			console.log('Permission already granted');
			fakeNotification();
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				if (permission === 'granted') {
					console.log('Permission granted');
					fakeNotification();
				} else {
					console.log('Permission denied');
				}
			});
		} else {
			console.log('Permission previously denied');
		}
	}
</script>

<div class="grid h-screen w-screen place-items-center">
	<div>
		<button onclick={checkNotificationPermission}> fake notification </button>
		<button
			onclick={subscribeToNotifications}
			disabled={isSubscribed}
			class={isSubscribed ? 'subscribed' : ''}
		>
			{isSubscribed ? 'Subscribed' : 'Subscribe to Notifications'}
		</button>
		<input type="text" bind:value={notificationInput} placeholder="Enter notification message" />
		<button onclick={sendNotification}> Send Notification </button>
	</div>
	<div>
		<button onclick={requestNotificationPermission}> request Notification permission </button>
		<p>todo: landing page content</p>
		<a href="/dash">
			<button class="rounded bg-panel p-4 transition-all hover:scale-125"> to dashboard </button>
		</a>
	</div>
</div>
