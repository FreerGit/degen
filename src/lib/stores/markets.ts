import { browser } from '$app/environment';
import { get_markets, type MarketsPerExchange } from '$lib/markets/get_markets';
import { writable } from 'svelte/store';

let markets = [] as MarketsPerExchange;

if (browser) {
	const local = localStorage.getItem('markets');
	if (local && markets.length == 0) {
		markets = JSON.parse(local);
  } else {
    const fetched_markets = await get_markets();
    console.log(fetched_markets);
    markets = fetched_markets;
  }
}

export const markets_store = writable<MarketsPerExchange>(markets);

if (browser) {
	markets_store.subscribe((v: MarketsPerExchange) => {
		localStorage.setItem('markets', JSON.stringify(v));
	});
}
