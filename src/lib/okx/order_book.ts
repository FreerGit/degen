/* eslint-disable no-self-assign */
import { get_exchange_endpoint } from '$lib/exchange';
import type { MarketInfo } from '$lib/markets/get_markets';
import { AbstractOrderBook } from '$lib/order_book';
import { P, match } from 'ts-pattern';
import type { Delta, Level, Payload, Update } from './types';

class OKXBook extends AbstractOrderBook {
	constructor(m: MarketInfo) {
		super();
		this.market_info = m;
	}

	get_endpoint(): string {
		return get_exchange_endpoint(this.market_info.exchange, this.market_info.type);
	}

	get_subscribe_string(): string {
		return `{"op": "subscribe", "args": [${JSON.stringify({
			channel: 'books',
			instId: this.market_info.market
		})}]}`;
	}

	get_ping_string(): string {
		return 'ping';
	}

	handle_message(message: string): void {
		const json: Payload = JSON.parse(message);
		match(json)
			.with({ action: 'update' }, () => {
				this.update_delta((json as Delta).data[0]);
			})
			.with({ action: 'snapshot' }, () => {
				this.update_delta((json as Delta).data[0]);
			})
			.with({ event: P.string }, () => {})
			.run();
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	snapshot(data: Update): void {}

	update_delta(data: Update): void {
		data.bids.forEach((lvl: Level) => {
			if (lvl[1] == '0') {
				this.bids.delete(+lvl[0]);
			} else {
				this.bids.set(+lvl[0], +lvl[1]);
			}
		});
		data.asks.forEach((lvl: Level) => {
			if (lvl[1] == '0') {
				this.asks.delete(+lvl[0]);
			} else {
				this.asks.set(+lvl[0], +lvl[1]);
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
export { OKXBook };
