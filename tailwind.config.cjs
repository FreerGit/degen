/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'app-sell': '#DD0049',
				'app-buy': '#00DD94',
				'app-milk': '#D1D4DC'
			}
		}
	},
	plugins: [require('daisyui')]
};
