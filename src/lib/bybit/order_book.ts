import { add_orderbook_pair_suffix, get_exchange_endpoint } from '$lib/exchange';
import type { MarketInfo } from '$lib/markets/get_markets';
import { AbstractOrderBook, type Level } from '$lib/order_book';
import type { OrderBook } from '$lib/types';

class BybitBook extends AbstractOrderBook {
	constructor(m: MarketInfo) {
		super();
		this.market_info = m;
	}

	get_endpoint(): string {
		return get_exchange_endpoint(this.market_info.exchange, this.market_info.type);
	}

	get_subscribe_args(): string {
		return add_orderbook_pair_suffix(this.market_info.exchange, this.market_info.market);
	}

	snapshot(data: OrderBook): void {
		data.b.forEach((lvl: Level) => {
			this.bids.set(lvl[0], lvl[1]);
		});
		data.a.forEach((lvl: Level) => {
			this.asks.set(lvl[0], lvl[1]);
		});
	}

	update_delta(data: OrderBook): void {
		data.b.forEach((lvl: Level) => {
			if (lvl[1] == 0) {
				this.bids.delete(lvl[0]);
			} else {
				this.bids.set(lvl[0], lvl[1]);
			}
		});
		data.a.forEach((lvl: Level) => {
			if (lvl[1] == 0) {
				this.asks.delete(lvl[0]);
			} else {
				this.asks.set(lvl[0], lvl[1]);
			}
		});

		let largest = 0;
		this.delta =
			this.bids.reduce((acc, lvl) => {
				if (lvl[1] > largest) {
					largest = lvl[1];
				}
				return acc + lvl[1];
			}, 0) -
			this.asks.reduce((acc, lvl) => {
				if (lvl[1] > largest) {
					largest = lvl[1];
				}
				return acc + lvl[1];
			}, 0);
		this.highest_vol_level = largest;
	}
}

export type { Level };
export { BybitBook };
