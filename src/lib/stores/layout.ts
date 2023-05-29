import { browser } from '$app/environment';
import type { OrderBookOptions } from '$lib/components/order_book.svelte';
import type { TradeFeedOption } from '$lib/components/trade_feed.svelte';
import { writable } from 'svelte/store';

interface Layout {
	trade_feeds: TradeFeedOption;
	order_book: OrderBookOptions;
}

let layout = {
	trade_feeds: [
		{
			min_size: 15000,
			markets: [
				{
					exchange: 'Bybit',
					type: 'linear',
					market: 'BTCUSDT'
				},
				{
					exchange: 'Binance',
					type: 'linear',
					market: 'BTCUSDT'
				}
			]
		}
	],
	order_book: {
		markets: [
			{
				exchange: 'Bybit',
				type: 'linear',
				market: 'BTCUSDT'
			}
		]
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
