/** @type {import('tailwindcss').Config} */

// https://daisyui.com/docs/colors/
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			fontSize: {
				'2xs': ['0.75rem', '0.9rem']
			},
			colors: {
				'color-scheme': 'dark',
				primary: '#1C4E80',
				secondary: '#7C909A',
				accent: '#EA6947',
				neutral: '#23282E',
				'base-hover': '#232323',
				'base-100': '#202020',
				'base-200': '#1d1d1d',
				'base-300': '#1a1a1a',
				'base-content': '#d2d2d2',
				info: '#0091D5',
				success: '#6BB187',
				warning: '#DBAE59',
				error: '#AC3E31'
			}
		}
	},
	plugins: []
};
