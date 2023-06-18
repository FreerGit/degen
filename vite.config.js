import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
	if (command === 'serve') {
		return {
			plugins: [sveltekit()],
			build: {
				target: 'esnext'
			}
		};
	} else {
		return {
			plugins: [sveltekit()],
			build: {
				target: 'esnext'
			},
			ssr: {
				noExternal: ['sorted-btree']
			}
		};
	}
});
