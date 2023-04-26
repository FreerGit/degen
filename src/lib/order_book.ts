import type { MarketInfo } from './markets/get_markets';
import type { OrderBook } from './types';

import BTree from 'sorted-btree';

type Price = number;
type Size = number;

type Level = [Price, Size];

const comp = (a: number, b: number) => {
	if (a > b) return -1;
	else if (a < b) return 1;
	else return 0;
};

abstract class AbstractOrderBook {
	asks: BTree<Price, Size>;
	bids: BTree<Price, Size>;
	delta: number;
	market_info: MarketInfo;
	highest_vol_level: number;

	constructor() {
		this.asks = new BTree(undefined, comp);
		this.bids = new BTree(undefined, comp);
		this.delta = 0;
		this.market_info;
		this.highest_vol_level = 1;
	}

	abstract get_endpoint(): string;

	abstract get_subscribe_string(): string;

	abstract get_ping_string(): string;

	abstract handle_message(message: string): void;

	abstract update_delta(data: OrderBook): void;

	abstract snapshot(data: OrderBook): void;
}

export { AbstractOrderBook };
export type { Price, Size, Level };
