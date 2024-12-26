import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

/** @type {import('vite').UserConfig} */
export default {
	server: {
		proxy: {
			'/api': {
				target: 'http://localhost:5600',
				changeOrigin: true,
				rewrite: (path: string) => path.replace(/^\/api/, '')
			}
		}
	},
	plugins: [
		nodePolyfills(),
		sveltekit(),
		SvelteKitPWA({
			// Options for PWA configuration
			registerType: 'autoUpdate',
			workbox: {
				globPatterns: [
					'client/**/*.{js,css,ico,png,svg,webp,webmanifest}',
					'prerendered/**/*.html'
				]
			},
			manifest: {
				name: 'Sovereign',
				short_name: 'Sovereign',
				description: 'A solana geopolitical battle royale game',
				theme_color: '#ffffff',
				icons: [
					{
						src: 'pwa/sovereign-48x48.png',
						sizes: '48x48',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-72x72.png',
						sizes: '72x72',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-96x96.png',
						sizes: '96x96',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-128x128.png',
						sizes: '128x128',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-144x144.png',
						sizes: '144x144',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-152x152.png',
						sizes: '152x152',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-192x192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-256x256.png',
						sizes: '256x256',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-384x384.png',
						sizes: '384x384',
						type: 'image/png'
					},
					{
						src: 'pwa/sovereign-512x512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	]
};
