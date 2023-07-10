<script lang="ts" context="module">
	export type PanelType = 'OB' | 'Trade';
</script>

<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';
	import OrderBook from '$lib/components/order_book.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import { new_orderbook_instance } from '$lib/exchange';
	import { TradeFeedHandler } from '$lib/trade_feed';
	import type { TFO } from '$lib/components/trade_feed.svelte';
	import TradeFeed from '$lib/components/trade_feed.svelte';
	import { AbstractOrderBook } from '$lib/order_book';

	const populate_default_layout = () => {
		const obs = $layoutStore.order_book.markets.map((m: MarketInfo) => {
			return new_orderbook_instance(m);
		});

		const tfs = $layoutStore.trade_feeds.map((tfo: TFO) => {
			return new TradeFeedHandler(100, tfo);
		});

		return [...obs, ...tfs];
	};

	let component_list = populate_default_layout();

	const add_panel = (m: Array<MarketInfo>, panel_type: PanelType) => {
		if (panel_type == 'Trade') {
			const tfo = { min_size: 15000, markets: m };
			component_list.push(new TradeFeedHandler(100, tfo));
			$layoutStore.trade_feeds = [...$layoutStore.trade_feeds, tfo];
		} else {
			component_list.push(new_orderbook_instance(m[0]));
			$layoutStore.order_book.markets = [...$layoutStore.order_book.markets, ...m];
		}
		component_list = component_list;
	};

	const remove_comp = (item: AbstractOrderBook | TradeFeedHandler) => {
		if (item instanceof AbstractOrderBook) {
			component_list = component_list.filter((value) => !Object.is(value, item));
			const new_layout = $layoutStore.order_book.markets.filter((i) => i !== item.market_info);
			$layoutStore.order_book.markets = new_layout;
		} else {
			component_list = component_list.filter((value) => !Object.is(value, item));
			const new_layout = $layoutStore.trade_feeds.filter((i) => {
				return i !== item.tfo;
			});
			$layoutStore.trade_feeds = new_layout;
		}
	};

	const swapElements = (
		comps: (AbstractOrderBook | TradeFeedHandler)[],
		idx1: number,
		idx2: number
	) => {
		const moves_first_to_last = idx1 == -1 && idx2 == 0;
		const moves_last_to_first = idx1 == comps.length;
		if (!moves_first_to_last && !moves_last_to_first) {
			// Do not shift the array in a circular manner
			let temp = comps[idx1];
			comps[idx1] = comps[idx2];
			comps[idx2] = temp;
		}
	};

	const move_comp_left = (comp: AbstractOrderBook | TradeFeedHandler) => {
		const idx = component_list.findIndex((v) => Object.is(comp, v));
		swapElements(component_list, idx - 1, idx);
		component_list = component_list;
	};

	const move_comp_right = (comp: AbstractOrderBook | TradeFeedHandler) => {
		const idx = component_list.findIndex((v) => Object.is(comp, v));
		swapElements(component_list, idx + 1, idx);
		component_list = component_list;
	};
</script>

<main class="flex flex-row h-full space-x-2 px-1 justify-between bg-base-100">
	{#each component_list as comp, index}
		<div class="max-h-screen min-w-[150px] max-w-[20%] border overflow-y-auto no-scrollbar">
			{#if comp instanceof AbstractOrderBook}
				<OrderBook
					id={index}
					on_delete={() => remove_comp(comp)}
					order_book={comp}
					on_left={() => move_comp_left(comp)}
					on_right={() => move_comp_right(comp)}
				/>
			{:else if comp instanceof TradeFeedHandler}
				<TradeFeed
					options={comp.tfo}
					on_delete={() => remove_comp(comp)}
					on_left={() => move_comp_left(comp)}
					on_right={() => move_comp_right(comp)}
				/>
			{/if}
		</div>
	{/each}
	<div class="w-full" />

	<MenuButton handle_panel={add_panel} />
</main>
