import { get_binance_markets } from '$lib/binance/get_markets';
import { get_bybit_markets } from '$lib/bybit/get_market';
import { get_okx_markets } from '$lib/okx/get_markets';
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
	const markets = await Promise.all([
		get_bybit_markets(),
		get_binance_markets(),
		get_okx_markets()
	]);

	return markets.flat(1);
};
