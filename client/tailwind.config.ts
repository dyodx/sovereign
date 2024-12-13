import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			boxShadow: {
				flat: '4px 4px 0 rgba(0, 0, 0, 0.5)'
			},
			fontFamily: {
				body: 'var(--font-body)',
				mono: 'var(--font-mono)',
				header: 'var(--font-header)'
			},
			colors: {
				background: '#1E1E1E',
				foreground: '#CCC',
				panel: '#303030'
			}
		}
	},

	plugins: [typography, containerQueries]
} satisfies Config;
