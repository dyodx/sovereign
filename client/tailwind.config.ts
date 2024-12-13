import containerQueries from '@tailwindcss/container-queries';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				background: '#1E1E1E',
				foreground: '#CCC',
				panel: '#303030'
			}
		}
	},

	plugins: [typography, containerQueries]
} satisfies Config;
