<script lang="ts">
	import type { MarketInfo } from '$lib/markets/get_markets';
	import type { PanelType } from '../../routes/+page.svelte';
	import PickOrderbookModal from './pick_orderbook_modal.svelte';
	import PickTradeFeedModal from './pick_trade_feed_modal.svelte';

	export let handle_panel: (m: Array<MarketInfo>, panel_type: PanelType) => void;
	let is_fullscreen = false;
	let open = false;
	let add_ob_modal = false;
	let add_trade_feed_modal = false;

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
	// let options = $layoutStore.trade_feeds;
	let button_style = 'flex min-w-full px-4 py-2 hover:bg-base-hover text-base-content';
</script>

<PickTradeFeedModal
	bind:open={add_trade_feed_modal}
	title="Choose markets for trade feed"
	update={(m) => handle_panel(m, 'Trade')}
/>

<PickOrderbookModal
	bind:open={add_ob_modal}
	title={'Choose order book'}
	update={(m) => handle_panel([m], 'OB')}
/>

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
		<button
			on:click={() => {
				add_trade_feed_modal = true;
				open = false;
			}}
			class={button_style}>Add Trade Feed</button
		>
		<button
			on:click={() => {
				add_ob_modal = true;
				open = false;
			}}
			class={button_style}>Add Order Book</button
		>
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
