<script lang="ts">
	export let handle_panel: () => void;
	let is_fullscreen = false;
	let open = false;

	const handle_fullscreen = () => {
		if (is_fullscreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		open = false;
	};

	const check_fullscreen = () => {
		document.fullscreenElement ? (is_fullscreen = true) : (is_fullscreen = false);
	};

	let button_style = 'flex min-w-full px-4 py-2 hover:bg-base-hover text-base-content';
</script>

{#if open}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div
		on:click={() => (open = false)}
		class="absolute top-0 bottom-0 left-0 right-0"
		style="z-index: 100;"
	/>
	<div
		class="absolute bottom-20 right-6 w-48 py-2 mt-1 bg-base-200 rounded shadow-md"
		style="z-index: 1000;"
	>
		<button on:click={handle_panel} class={button_style}>Add Panel</button>
		{#if is_fullscreen}
			<button on:click={handle_fullscreen} class={button_style}>Exit Fullscreen</button>
		{:else}
			<button on:click={handle_fullscreen} class={button_style}>Fullscreen</button>
		{/if}
	</div>
{/if}

<button
	on:mouseenter={check_fullscreen}
	on:click={() => (open = true)}
	class="absolute bottom-6 right-6 w-12 h-12 bg-base-200 rounded-full hover:bg-base-hover active:shadow-lg shadow transition ease-in duration-200 focus:outline-none"
>
	<svg viewBox="0 0 20 20" enable-background="new 0 0 20 20" class="w-6 h-6 inline-block">
		<path
			fill="#FFFFFF"
			d="M16,10c0,0.553-0.048,1-0.601,1H11v4.399C11,15.951,10.553,16,10,16c-0.553,0-1-0.049-1-0.601V11H4.601
                        C4.049,11,4,10.553,4,10c0-0.553,0.049-1,0.601-1H9V4.601C9,4.048,9.447,4,10,4c0.553,0,1,0.048,1,0.601V9h4.399
                        C15.952,9,16,9.447,16,10z"
		/>
	</svg>
</button>
