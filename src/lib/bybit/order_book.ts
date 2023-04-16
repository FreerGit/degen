import type { MarketInfo } from '$lib/markets/get_markets';
import { AbstractOrderBook } from '$lib/order_book';
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

class BybitBook extends AbstractOrderBook {
	constructor(m: MarketInfo) {
		super();
		this.market = m.market;
		this.exchange = m.exchange;
	}

	get_endpoint(): string {
		return "wss://stream.bybit.com/realtime_public";
	}

	get_subscribe_args(): string {
		return `orderBookL2_25.${this.market}`
	}

	update_delta(updates: Updates): void {
		this.delete(updates.delete);
		this.snapshot(updates.insert);
		this.update(updates.update);
		this.delta =
			this.bids.reduce((a, b) => a + b.size, 0) - this.asks.reduce((a, b) => a + b.size, 0);
		this.highest_vol_level = this.get_highest_vol_level()
			
	}

	snapshot(to_insert: Array<Level>) {
		to_insert.forEach((level) => {
			if (level.side === 'Buy') {
				sorted_insert(this.bids, level);
			} else {
				sorted_insert(this.asks, level);
			}
		});
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

	get_highest_vol_level(): number {
		let largest = 0;
		for (let i = 0; i < this.bids.length; i++) {
			if (this.bids[i].size > largest) {
				largest = this.bids[i].size;
			} 
		}
		for (let i = 0; i < this.asks.length; i++) {
			if (this.asks[i].size > largest) {
				largest = this.asks[i].size;
			}
		}
		return largest;
	}
}

export type { Side, Level, DeleteLevel };
export { BybitBook };
