import { browser } from '$app/environment';
import type { OrderBookOptions } from '$lib/components/order_book.svelte';
import type { TradeFeedOption } from '$lib/components/trade_feed.svelte';
import { writable } from 'svelte/store';

interface Layout {
	trade_feed: TradeFeedOption;
	order_book: OrderBookOptions;
}

// @TODO the trade. and orderBookL2_25 part is hardcoded, later this will be a match depending on exchange.
let layout = {
	trade_feed: {
		min_size: 15000,
		markets: [
			{
				exchange: 'Bybit',
				type: 'linear',
				market: 'BTCUSDT'
			},
			{
				exchange: 'Bybit',
				type: 'inverse',
				market: 'BTCUSD'
			}
		]
	},
	order_book: {
		market: 'orderBookL2_25.BTCUSDT'
	}
} as Layout;

if (browser) {
	const local = localStorage.getItem('layout');
	if (local) {
		layout = JSON.parse(local);
	}
}

export const layoutStore = writable<Layout>(layout);

if (browser) {
	layoutStore.subscribe((v: Layout) => {
		localStorage.setItem('layout', JSON.stringify(v));
	});
}
