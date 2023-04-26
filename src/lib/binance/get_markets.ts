import type { MarketsPerExchange, MarketType } from '$lib/markets/get_markets';


type ticker = {
	symbol: string;
};

export const get_binance_markets = async (): Promise<MarketsPerExchange> => {
	const markets: MarketsPerExchange = [];
	const markets_promises = await Promise.all([
		fetch('https://fapi.binance.com/fapi/v1/ticker/price'),
		fetch('https://data.binance.com/api/v3/ticker/price'),
	]);

	// console.log(await markets_promises[0].json())
	const [spot, linear]: Array<Array<ticker>> = await Promise.all(
		markets_promises.map((v) => v.json())
	);

	markets.push({
		exchange: 'Binance',
		market_type: 'spot',
		markets: spot.map((f) => f.symbol)
	});
	markets.push({
		exchange: 'Binance',
		market_type: 'linear',
		markets: linear.map((f) => f.symbol)
	});
	
  
	return markets;
};
