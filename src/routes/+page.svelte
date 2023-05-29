<script lang="ts" context="module">
	export type PanelType = 'OB' | 'Trade';
</script>

<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';
	import Grid from 'svelte-grid';
	import gridHelp from 'svelte-grid/build/helper/index.mjs';
	import OrderBook from '$lib/components/order_book.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { new_orderbook_instance } from '$lib/exchange';
	import { TradeFeedHandler } from '$lib/trade_feed';
	import type { TFO } from '$lib/components/trade_feed.svelte';
	import TradeFeed from '$lib/components/trade_feed.svelte';

	const id = () => '_' + Math.random().toString(36).substr(2, 9);

	const COLS = 100;

	const populate_default_layout = () => {
		let counter = -1;
		const obs = $layoutStore.order_book.markets.map((m: MarketInfo) => {
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
					book: new_orderbook_instance(m),
					trade_feed: undefined
				}
			};
		});

		const tfs = $layoutStore.trade_feeds.map((tfo: TFO) => {
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
					book: undefined,
					trade_feed: new TradeFeedHandler(100, tfo)
				}
			};
		});

		return [...obs, ...tfs];
	};

	let items = populate_default_layout();

	const add_panel = (m: Array<MarketInfo>, panel_type: PanelType) => {
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
				book: panel_type == 'OB' ? new_orderbook_instance(m[0]) : undefined,
				trade_feed:
					panel_type == 'Trade'
						? new TradeFeedHandler(100, { min_size: 15000, markets: m })
						: undefined
			}
		});
		items = items;
		$layoutStore.order_book.markets = [...$layoutStore.order_book.markets, ...m];
	};

	const remove_ob = (item: any) => {
		items = items.filter((value) => value.id !== item.id);
		console.log(item.data);

		const new_layout = $layoutStore.order_book.markets.filter(
			(i) => i !== item.data.book.market_info
		);
		$layoutStore.order_book.markets = new_layout;
	};

	const remove_tf = (item: any) => {
		items = items.filter((value) => value.id !== item.id);
		console.log(item.data);
		const new_layout = $layoutStore.trade_feeds.filter((i) => {
			console.log(i);
			return i !== item.data.trade_feed.tfo;
		});
		$layoutStore.trade_feeds = new_layout;
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
		{#if dataItem.data.book !== undefined}
			<OrderBook
				id={dataItem.id}
				on_delete={() => remove_ob(dataItem)}
				order_book={dataItem.data.book}
			/>
		{:else if dataItem.data.trade_feed !== undefined}
			<TradeFeed options={dataItem.data.trade_feed.tfo} on_delete={() => remove_tf(dataItem)} />
		{/if}
	</Grid>

	<MenuButton handle_panel={add_panel} />
</main>
