import { get_bybit_markets } from '$lib/bybit/get_market';
import type { Exchange } from '$lib/types';

export type MarketType = 'spot' | 'linear' | 'inverse';

export type MarketsPerExchange = Array<MarketAtExchange>;

export type MarketAtExchange = {
	exchange: Exchange;
	market_type: MarketType;
	markets: Array<string>;
};

export type MarketInfo = {
	exchange: Exchange;
	type: MarketType;
	market: string;
};

export const get_markets = async (): Promise<MarketsPerExchange> => {
	return await get_bybit_markets();
};
