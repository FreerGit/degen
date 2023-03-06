/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'primary': '#202020',
				'primary': '#b8dcff',

				'secondary': '#7c909a',
				'secondary': '#002538',

				'accent': '#ea6947',
				'accent-content': '#3d0d00',

				'neutral': '#23282e',
				'neutral-content': '#c8d3e0',

				base: {
					100: '#202020',
					200: '#1d1d1d',
					300: '#1a1a1a'
				},

				'app-sell': '#DD0049',
				'app-buy': '#00DD94',
				'app-milk': '#D1D4DC'
			}
		}
	},
	plugins: []
};
