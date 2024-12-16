/// <reference lib="webworker" />
import { build, files, prerendered, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `cache-${version}`;

self.addEventListener('install', (event: ExtendableEvent) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll([...build, ...files, ...prerendered]);
		})
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keys) => {
			return Promise.all(
				keys
					.filter((key) => key !== CACHE_NAME)
					.map((key) => caches.delete(key))
			);
		})
	);
});

self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request).then((cachedResponse) => {
			return cachedResponse || fetch(event.request);
		})
	);
});

self.addEventListener('push', (event) => {
	const data = event?.data?.json();
	event.waitUntil(
		self.registration.showNotification(data.title, {
			body: data.body,
			icon: 'path/to/icon.png'
		})
	);
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
	event.notification.close();
	event.waitUntil(
		self.clients
			.matchAll({ type: 'window' })
			.then((clientList: readonly WindowClient[]) => {
				for (const client of clientList) {
					if (client.url === '/' && 'focus' in client) return client.focus();
				}
				if (self.clients.openWindow) return self.clients.openWindow('/');
			})
	);
});
