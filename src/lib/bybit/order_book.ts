import { OrderBook } from '$lib/order_book';
import { sorted_insert, sorted_update } from '$lib/sorted_array';
import type { Updates } from '$lib/types';

type Side = 'Buy' | 'Sell';

type Level = {
	price: string;
	symbol: string;
	side: Side;
	size: number;
};

type DeleteLevel = {
	price: string;
	symbol: string;
	side: Side;
};

class BybitBook extends OrderBook {
	constructor() {
		super();
		this.market = 'BTCUSDT';
		this.full_market_name = 'bybit/' + this.market;
	}

	update_delta(updates: Updates): void {
		this.delete(updates.delete);
		this.insert(updates.insert);
		this.update(updates.update);
		this.delta =
			this.bids.reduce((a, b) => a + b.size, 0) - this.asks.reduce((a, b) => a + b.size, 0);
	}

	delete(to_delete: Array<DeleteLevel>): void {
		to_delete.forEach((level) => {
			if (level.side === 'Buy') {
				this.bids = this.bids.filter((curr_level) => curr_level.price !== level.price);
			} else {
				this.asks = this.asks.filter((curr_level) => curr_level.price !== level.price);
			}
		});
	}

	update(to_update: Array<Level>): void {
		to_update.forEach((level) => {
			if (level.side === 'Buy') {
				sorted_update(this.bids, level);
			} else {
				sorted_update(this.asks, level);
			}
		});
	}

	insert(to_insert: Array<Level>): void {
		to_insert.forEach((level) => {
			if (level.side === 'Buy') {
				sorted_insert(this.bids, level);
			} else {
				sorted_insert(this.asks, level);
			}
		});
	}
}

export type { Side, Level, DeleteLevel };
export { BybitBook };
