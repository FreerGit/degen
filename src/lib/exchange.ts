import type { MarketInfo, MarketType } from './markets/get_markets';
import type { Exchange } from './types';

export const get_exchange_trade_endpoint = (exchange: Exchange, type: MarketType) => {
	switch (exchange) {
		case 'Bybit':
			switch (type) {
				case 'spot':
					return 'wss://stream.bybit.com/v5/public/spot';
				case 'inverse':
					return 'wss://stream.bybit.com/v5/public/inverse';
				case 'linear':
					return 'wss://stream.bybit.com/v5/public/linear';
			}
		case 'Binance':
			return 'wss://stream.binance.com:9443/ws';
	}
};

export const add_trade_pair_suffix = (exchange: Exchange, market: string): string => {
	switch (exchange) {
		case 'Bybit':
			return `publicTrade.${market}`;
		case 'Binance':
			return `${market}@aggTrade`;
	}
};

export const get_trade_subscription_string = (
	exchange: Exchange,
	markets: Array<string>
): string => {
	const to_sub_array = markets.map((m) => add_trade_pair_suffix(exchange, m));
	switch (exchange) {
		case 'Bybit':
			return `{"op": "subscribe", "args": ${JSON.stringify(to_sub_array)}}`;

		case 'Binance':
			throw console.error('get_trade_sub....');
	}
};
