import type { MarketsPerExchange } from '$lib/markets/get_markets';



export const get_okx_markets = async (): Promise<MarketsPerExchange> => {
	const markets = await fetch("/api/okx_markets");
	const json = await markets.json();
	return json;
};
