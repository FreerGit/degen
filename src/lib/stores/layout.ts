import { browser } from '$app/environment';
import type { OrderBookOption } from '$lib/components/order_book.svelte';
import type { TradeFeedOption } from '$lib/components/trade_feed.svelte';
import { writable } from 'svelte/store';

export const ComponentType = ['TF', 'OB'] as const;

export type Component = (typeof ComponentType)[number];

interface Layout {
	component: (TradeFeedOption | OrderBookOption)[];
}

let layout: Layout = {
	component: [
		{
			type: 'OB',
			markets: {
				exchange: 'Bybit',
				type: 'linear',
				market: 'BTCUSDT'
			}
		},
		{
			type: 'OB',
			markets: {
				exchange: 'Bybit',
				type: 'spot',
				market: 'BTCUSDT'
			}
		},
		{
			type: 'OB',
			markets: {
				exchange: 'OKX',
				type: 'spot',
				market: 'BTC-USDT'
			}
		},
		{
			type: 'TF',
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
				},
				{
					exchange: 'Bybit',
					type: 'spot',
					market: 'BTCUSDT'
				},
				{
					exchange: 'Binance',
					type: 'spot',
					market: 'BTCUSDT'
				}
			]
		}
	]
};

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
