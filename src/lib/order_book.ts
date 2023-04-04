import type { Level } from './bybit/order_book';
import type { Exchange, Updates } from './types';

abstract class OrderBook {
	asks: Array<Level>;
	bids: Array<Level>;
	delta: number;
	market: string;
	exchange: Exchange;

	constructor() {
		this.asks = [];
		this.bids = [];
		this.delta = 0;
		this.market = '';
		this.exchange = '';
	}

	abstract update_delta(updates: Updates): void;
}

export { OrderBook };
