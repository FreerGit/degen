import { browser } from '$app/environment';
import { get_markets, type MarketsPerExchange } from '$lib/markets/get_markets';
import { writable } from 'svelte/store';

let markets = [] as MarketsPerExchange;

const fetch_wrapper = async () => {
	return await get_markets();
};

if (browser) {
	const local = localStorage.getItem('markets');
	if (local && markets.length == 0) {
		markets = JSON.parse(local);
	} else {
		markets = await fetch_wrapper();
	}
}

export const markets_store = writable<MarketsPerExchange>(markets);

if (browser) {
	markets_store.subscribe((v: MarketsPerExchange) => {
		localStorage.setItem('markets', JSON.stringify(v));
	});
}
