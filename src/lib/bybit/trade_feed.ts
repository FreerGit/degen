import type { MarketType } from '$lib/markets/get_markets';
import { push_front } from '$lib/rotate_array';
import type { TradeFeedHandler } from '$lib/trade_feed';
import type { Payload, Trades } from '$lib/types';
import { match, P } from 'ts-pattern';

export const handle_bybit_trade_message = (
	feed: TradeFeedHandler,
	msg: string,
	type: MarketType
) => {
	const json: Payload = JSON.parse(msg);
	match(json)
		.with({ data: P.array({ S: P.string }) }, () => {
			(json as Trades).data.forEach((i) => {
				if (type == 'inverse') {
					if (+i.v > feed.min_size) {
						feed.trades = push_front(feed.trades, {
							price: i.p,
							size: i.v,
							side: i.S,
							type: type,
							exchange: 'Bybit'
						});
					}
				} else {
					if (i.v * i.p > feed.min_size) {
						feed.trades = push_front(feed.trades, {
							price: i.p,
							size: i.v,
							side: i.S,
							type: type,
							exchange: 'Bybit'
						});
					}
				}
			});
		})
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		.with({ success: P.boolean }, () => {})
		.run();
};
