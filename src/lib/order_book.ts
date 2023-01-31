import type { Level } from './bybit/order_book';
import type { Updates } from './types';

abstract class OrderBook {
	asks: Array<Level>;
	bids: Array<Level>;
	delta: number;
	market: string;
	full_market_name: string;

	constructor() {
		this.asks = [];
		this.bids = [];
		this.delta = 0;
		this.market = "";
		this.full_market_name = "";
	}

	abstract update_delta(updates: Updates): void;
}

export { OrderBook };
