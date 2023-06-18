import { add_orderbook_pair_suffix, get_exchange_endpoint } from '$lib/exchange';
import type { MarketInfo } from '$lib/markets/get_markets';
import { AbstractOrderBook, type Level } from '$lib/order_book';
import { P, match } from 'ts-pattern';
import type { OrderBook, OrderBook_ } from './types';

class BinanceBook extends AbstractOrderBook {
	constructor(m: MarketInfo) {
		super();
		this.market_info = m;
	}

	get_endpoint(): string {
		return get_exchange_endpoint(this.market_info.exchange, this.market_info.type);
	}
	// {"method": "SUBSCRIBE", "params": ["btcusdt@trade"], "id": 1}
	// {"method": "SUBSCRIBE","params": ["ETHUSDT@depth20@100ms"],"id": 1}
	get_subscribe_string(): string {
		return `{"method": "SUBSCRIBE","params": 
			["${add_orderbook_pair_suffix(this.market_info.exchange, this.market_info.market)}"], 
			"id": 1}`;
	}

	get_ping_string(): string {
		return 'ping';
	}

	handle_message(message: string): void {
		const json = JSON.parse(message, function (key, value) {
			if (key === 'asks' || key === 'a') {
				return value.map((lvl: Level) => {
					return [+lvl[0], +lvl[1]];
				});
			}
			if (key === 'bids' || key === 'b') {
				return value.map((lvl: Level) => {
					return [+lvl[0], +lvl[1]];
				});
			}
			return value;
		});
		match(json)
			.with({ lastUpdateId: P.number }, () => {
				this.replace(json);
			})
			.with({ e: 'depthUpdate' }, () => {
				this.replace_(json);
			})

			.with({ result: null, id: 1 }, (_) => {})
			.run();
	}

	snapshot(data: OrderBook): void {
		throw new Error('Method not implemented.');
	}

	replace_(data: OrderBook_): void {
		this.bids.clear();
		data.b.forEach((i: Level) => this.bids.set(i[0], i[1]));
		this.asks.clear();
		data.a.forEach((i: Level) => this.asks.set(i[0], i[1]));
		this.update_values();
	}

	replace(data: OrderBook): void {
		this.bids.clear();
		data.bids.forEach((i: Level) => this.bids.set(i[0], i[1]));
		this.asks.clear();
		data.asks.forEach((i: Level) => this.asks.set(i[0], i[1]));
		this.update_values();
	}

	update_delta(data: OrderBook): void {
		this.update_values();
	}

	update_values(): void {
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
export { BinanceBook };
