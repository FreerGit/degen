import type { Level } from './bybit/order_book';
import type { Exchange, Updates } from './types';

abstract class AbstractOrderBook {
	asks: Array<Level>;
	bids: Array<Level>;
	delta: number;
	market: string;
	exchange: Exchange;
	highest_vol_level: number;

	constructor() {
		this.asks = [];
		this.bids = [];
		this.delta = 0;
		this.market = '';
		this.exchange = '';
		this.highest_vol_level = 1;
	}

	abstract get_endpoint(): string;

	abstract get_subscribe_args(): string;

	abstract update_delta(updates: Updates): void;

	abstract snapshot(to_insert: Array<Level>): void;

}

export { AbstractOrderBook };
