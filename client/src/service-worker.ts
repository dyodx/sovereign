/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
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
	console.log('hi mom', data);
	event.waitUntil(
		self.registration.showNotification('HI', { body: 'himom' })
		// self.registration.showNotification(data.title, {
		// 	body: data.body
		// 	// icon: 'static/pwa/sovereign-128x128.png'
		// })
	);
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
	console.log('Notification clicked');
	event.notification.close();

	// This looks for a window client to focus/open
	event.waitUntil(
		self.clients
			.matchAll({
				type: 'window',
				includeUncontrolled: true
			})
			.then((clientList) => {
				if (clientList.length > 0) {
					// Focuses an existing window
					return clientList[0].focus();
				} else {
					// Opens a new window
					if (self.clients.openWindow) {
						return self.clients.openWindow('/');
					}
				}
			})
	);
});
