import * as layout from '$lib/db';
import { writable } from 'svelte/store';
import type { TradeFeedOptions } from './components/trade_feed.svelte';

export const create_layout_store = () => {
  const store = writable({});

  return {
    ...store,
    init: async () => {
      const trade_feeds = layout.get_layout();
      trade_feeds.then(feeds => {
        store.set(feeds);
      })
      return trade_feeds;
    },
    set: async (new_feeds: TradeFeedOptions) => {
      layout.update_layout(new_feeds);
      store.set(new_feeds);
    }
  }
}