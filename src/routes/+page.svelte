<script lang="ts">
	import { BybitBook } from '$lib/bybit/order_book';
	import { browser } from '$app/environment';
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';
	import Grid from 'svelte-grid';
	import gridHelp from 'svelte-grid/build/helper/index.mjs';
	import OrderBook from '$lib/components/order_book.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import TradeFeed from '$lib/components/trade_feed.svelte';

	const id = () => '_' + Math.random().toString(36).substr(2, 9);

	const COLS = 100;

	const populate_default_layout = () => {
		let counter = -1;
		return $layoutStore.order_book.markets.map((m: MarketInfo) => {
			counter++;
			return {
				[COLS]: gridHelp.item({
					x: 20 * counter,
					y: 0,
					w: 20,
					h: 20
				}),
				id: id(),
				data: {
					book: new BybitBook(m)
				}
			};
		});
	};

	let items = populate_default_layout();

	const add_panel = (m: MarketInfo) => {
		const prev = items.at(-1);
		items.push({
			[COLS]: gridHelp.item({
				x: prev ? prev[COLS].w * items.length : 0,
				y: 0,
				w: 20,
				h: 20
			}),
			id: id(),
			data: {
				book: new BybitBook(m)
			}
		});
		items = items;
		$layoutStore.order_book.markets = [...$layoutStore.order_book.markets, m];
	};

	const remove_panel = (item: any) => {
		items = items.filter((value) => value.id !== item.id);
		const new_layout = $layoutStore.order_book.markets.filter(
			(i) => i !== item.data.book.market_info
		);
		$layoutStore.order_book.markets = new_layout;
	};

	const cols = [[2000, COLS]];
</script>

<main class="flex flex-row min-h-full h-full min-w-full justify-between bg-base-100">
	<Grid
		bind:items
		rowHeight={50}
		let:dataItem
		{cols}
		fastStart={true}
		fillSpace={true}
		gap={[5, 0]}
	>
		<div class="h-full">
			<OrderBook on_delete={() => remove_panel(dataItem)} order_book={dataItem.data.book} />
		</div>
	</Grid>

	{#if browser}
		<TradeFeed bind:options={$layoutStore.trade_feed} />
	{/if}

	<MenuButton handle_panel={add_panel} />
</main>
