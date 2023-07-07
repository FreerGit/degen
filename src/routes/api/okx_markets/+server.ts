import type { MarketsPerExchange } from '$lib/markets/get_markets';

type ticker = {
	instId: string;
};

export async function GET() {
	const markets = await get_okx_markets();
	const json = await JSON.stringify(markets);
	return new Response(json);
}

const get_okx_markets = async (): Promise<MarketsPerExchange> => {
	const markets: MarketsPerExchange = [];
	const markets_promises = await fetch('https://aws.okx.com/api/v5/market/tickers?instType=SPOT', {
		referrerPolicy: 'no-referrer',
		mode: 'no-cors'
	});

	const j = await markets_promises.json();

	markets.push({
		exchange: 'OKX',
		market_type: 'spot',
		markets: j.data.map((f: ticker) => f.instId)
	});

	return markets;
};
