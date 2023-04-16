<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import type { Delta, Payload, Snapshot } from '$lib/types';
	import { onMount } from 'svelte';
	import { match, P } from 'ts-pattern';
	import TradeFeed from '$lib/components/trade_feed.svelte';
	import { browser } from '$app/environment';
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';
	import Grid from 'svelte-grid';
	import gridHelp from 'svelte-grid/build/helper/index.mjs';
	import OrderBook from '$lib/components/order_book.svelte';
	import type { AbstractOrderBook } from '$lib/order_book';
	import type { MarketInfo } from '$lib/markets/get_markets';

	const id = () => '_' + Math.random().toString(36).substr(2, 9);

	const COLS = 100;

	let layout = $layoutStore;

	const populate_default_layout = () => {
		return layout.order_book.markets.map((m: MarketInfo) => {
			return {
			[COLS]: gridHelp.item({
				x: 0,
				y: 0,
				w: 20,
				h: 19
			}),
			id: id(),
			data: {
				book: new BybitBook(m)
			}
		}
		})
	}

	let items = populate_default_layout();


	const add_panel = (m: MarketInfo) => {
		const prev = items.at(-1);
		items.push({
			[COLS]: gridHelp.item({
				x: prev ? prev[COLS].w * items.length: 0,
				y: 0,
				w: 20,
				h: 19,
			}),
			id: id(),
			data: {
				book: new BybitBook(m)
			}
		})
		items = items;
		layout.order_book.markets = [m]
	}

	const remove_panel = (item: any) => {
		items = items.filter((value) => value.id !== item.id);
	}

	const cols = [[2000, COLS]];


	// let bybit_book: AbstractOrderBook = new BybitBook();
</script>

<!-- https://tailwindcss.com/docs/table-layout#basic-usage -->
<main class="flex flex-row min-h-full h-full min-w-full justify-between bg-base-100">
	<!-- ONE COMPONENT L8R -->
	<Grid
		bind:items
		rowHeight={50}
		let:dataItem
		{cols}
		fastStart={true}
		fillSpace={true}
		gap={[5, 0]}
	>

		<OrderBook on_delete={() => remove_panel(dataItem)} order_book={dataItem.data.book}/>
	</Grid>
	
	{#if browser}
		<TradeFeed bind:options={layout.trade_feed} />
	{/if}
	
	<MenuButton handle_panel={add_panel}/>
</main>
