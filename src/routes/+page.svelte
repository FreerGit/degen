<script lang="ts" context="module">
	export type PanelType = 'OB' | 'Trade';
</script>

<script lang="ts">
	import { layoutStore } from '$lib/stores/layout';
	import MenuButton from '$lib/components/menu_button.svelte';
	import OrderBook, { type OrderBookOption } from '$lib/components/order_book.svelte';
	import type { MarketInfo } from '$lib/markets/get_markets';
	import TradeFeed, { type TradeFeedOption } from '$lib/components/trade_feed.svelte';

	// let component_list = populate_default_layout();

	const add_panel = (m: Array<MarketInfo>, panel_type: PanelType) => {
		let component_list = $layoutStore.component;
		if (panel_type == 'Trade') {
			const tfo: TradeFeedOption = {type: "TF", min_size: 15000, markets: m };
			component_list.push(tfo);
		} else {
			const ob: OrderBookOption = {type: 'OB', markets: m[0]};
			component_list.push(ob);
		}
		$layoutStore.component = component_list;
		$layoutStore.component = $layoutStore.component 
		// component_list = component_list;
	};

	// @TODO deletes wrong one
	const remove_comp = (item: (TradeFeedOption | OrderBookOption)) => {
		let component_list = $layoutStore.component.filter((value) => value !== item);
		$layoutStore.component = component_list;
		// component_list = component_list;
	};

	const swapElements = (
		comps: (TradeFeedOption | OrderBookOption)[],
		idx1: number,
		idx2: number
	) => {
		const moves_first_to_last = idx1 == -1 && idx2 == 0;
		const moves_last_to_first = idx1 == comps.length;
		// Do not shift the array in a circular manner
		console.log(idx1, idx2);
		if (!moves_first_to_last && !moves_last_to_first) {
			let temp = comps[idx1];
			comps[idx1] = comps[idx2];
			comps[idx2] = temp;
		}
	};

	const move_comp_left = (comp: OrderBookOption | TradeFeedOption) => {
		const idx = $layoutStore.component.findIndex((v) => comp == v);
		swapElements($layoutStore.component, idx - 1, idx);
		// component_list = component_list;
		$layoutStore.component = [... $layoutStore.component];

	};

	const move_comp_right = (comp: OrderBookOption | TradeFeedOption) => {
		const idx = $layoutStore.component.findIndex((v) => comp == v);
		swapElements($layoutStore.component, idx + 1, idx);
		// component_list = component_list;
		$layoutStore.component = $layoutStore.component;
	};
</script>

<main class="flex flex-row h-full space-x-2 px-1 justify-between bg-base-100">
	{#each $layoutStore.component as comp, index (comp)}
	<div class="max-h-screen min-w-[150px] max-w-[20%] border overflow-y-auto no-scrollbar">
			{#if comp.type == "OB"}
				<OrderBook
					id={index}
					on_delete={() => remove_comp(comp)}
					option={comp}
					on_left={() => move_comp_left(comp)}
					on_right={() => move_comp_right(comp)}
				/>
			{:else if comp.type == "TF"}
				<TradeFeed
					option={comp}
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
