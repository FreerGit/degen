import type { MarketType } from '$lib/markets/get_markets';
import { push_front } from '$lib/rotate_array';
import type { TradeFeedHandler } from '$lib/trade_feed';
import { match, P } from 'ts-pattern';
import type { Payload, Trades } from './types';

export const handle_okx_trade_message = (feed: TradeFeedHandler, msg: string, type: MarketType) => {
	const json: Payload = JSON.parse(msg);
	match(json)
		.with({ data: P.array({ px: P.string }) }, () => {
			(json as Trades).data.forEach((i) => {
				if (+i.sz * i.px > feed.min_size) {
					feed.trades = push_front(feed.trades, {
						price: i.px,
						size: i.sz,
						side: i.side,
						type: 'spot',
						exchange: 'OKX'
					});
				}
			});
		})
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		.with({ event: P.string }, () => {})
		.run();
};
