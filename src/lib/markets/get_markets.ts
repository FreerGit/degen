import { get_bybit_markets } from '$lib/bybit/get_market';
import type { Exchange } from '$lib/types';

export type MarketType = 'spot' | 'linear' | 'inverse' | 'inverseUSDT' | 'inverseUSDC';

export type MarketsPerExchange = Array<MarketAtExchange>;

export type MarketAtExchange = {
	exchange: Exchange;
	market_type: MarketType;
	markets: Array<string>;
};

export const get_markets = async (): Promise<MarketsPerExchange> => {
	return await get_bybit_markets();
};

export const add_market_suffix = (exchange: Exchange, market: string): string => {
	switch (exchange) {
		case 'Bybit':
			return `publicTrade.${market}`;
		case 'Binance':
			return `${market}@aggTrade`;
	}
};
