import { browser } from '$app/environment'
import { persisted } from 'svelte-local-storage-store'
import { writable } from 'svelte/store'
import type { OrderBookOptions } from './components/order_book.svelte'
import type { TradeFeedOptions } from './components/trade_feed.svelte'

interface Layout {
  trade_feed: TradeFeedOptions
  order_book: OrderBookOptions
}

// @TODO the trade. and orderBookL2_25 part is hardcoded, later this will be a match depending on exchange.
let layout = {
    trade_feed: {
      market: "trade.BTCUSDT",
      min_size: 3000,
    },
    order_book: {
      market: "orderBookL2_25.BTCUSDT"
    }
} as Layout
  
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
  })
}

