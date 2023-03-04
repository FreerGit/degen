import Dexie, { type Table, type Transaction } from 'dexie';
import { browser } from '$app/environment';
import type { TradeFeedOptions } from './components/trade_feed.svelte';

export const db = new Dexie('layout');

export type Layout = {
  trade_feeds: TradeFeedOptions,
  // @TODO UPDATE THIS L8r
  order_books: string, 
}

let opt: TradeFeedOptions = {
  market: "trade.BTCUSDT",
  min_size: 3000,
}

db.version(1).stores({
  trade_feeds: 'option',
  order_books: 'option',
});

db.on("populate", (txs: Transaction) => {
  txs.table('trade_feeds').add({option: JSON.stringify(opt)})
})

db.open();

export const get_layout = async () => {
  if (browser) {
    const tables = await Promise.all([
      db.table('trade_feeds').toArray(),
      db.table('order_books').get('option')
    ])
    return {
      trade_feeds: tables[0].map(f => JSON.parse(f.option)),
      order_books: tables[1],
    };
  }
}


// @TODO change this when order books
export const update_layout = (options: TradeFeedOptions) => {
  if (browser) {
    return db.table('trade_feeds').bulkPut([options]);
  }
  return Promise.resolve({});
}