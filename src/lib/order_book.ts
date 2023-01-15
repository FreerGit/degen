import type { Level } from './bybit/order_book';
import type { Updates } from './types';

abstract class OrderBook {
	asks: Array<Level>;
	bids: Array<Level>;

	constructor() {
		this.asks = [];
		this.bids = [];
	}

	abstract update_delta(updates: Updates): void;
}

export { OrderBook };
