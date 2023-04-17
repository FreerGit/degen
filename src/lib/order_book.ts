import type { Level } from './bybit/order_book';
import type { MarketInfo } from './markets/get_markets';
import type { OrderBook, Updates } from './types';
import BTree, { simpleComparator } from 'sorted-btree';

type Price = number;
type Size = number;

type Level = [Price, Size];

abstract class AbstractOrderBook {
	asks: BTree<Price,Size>;
	bids: BTree<Price,Size>;
	delta: number;
	market_info: MarketInfo;
	highest_vol_level: number;

	constructor() {
		this.asks = new BTree(undefined, (a, b) => {
			if (a > b)
				return 1;
			else if (a < b)
				return -1;
			else
				console.error("btree comparator bug");
				return 0;
		});
		this.bids = new BTree(undefined, (a, b) => {
			if (a > b)
				return -1;
			else if (a < b)
				return 1;
			else
				console.error("btree comparator bug");
				return 0;
		});;
		this.delta = 0;
		this.market_info;
		this.highest_vol_level = 1;
	}

	abstract get_endpoint(): string;

	abstract get_subscribe_args(): string;

	abstract update_delta(data: OrderBook): void;

	abstract snapshot(data: OrderBook): void;
}

export { AbstractOrderBook };
export type { Price, Size, Level };
