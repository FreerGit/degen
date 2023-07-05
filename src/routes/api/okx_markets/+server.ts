import type { MarketsPerExchange } from '$lib/markets/get_markets';

type tickers = {
	data: Array<ticker>;
};

type ticker = {
	instId: string;
};

export async function GET() { // note the capitalized method name

  // we can now simply pass on the original 3rd-party api response promise
  const markets = await get_okx_markets();
  const json = await JSON.stringify(markets);
  return new Response(json);
}

const get_okx_markets = async (): Promise<MarketsPerExchange> => {
	const markets: MarketsPerExchange = [];
	const markets_promises = await Promise.all([
		fetch('https://aws.okx.com/api/v5/market/tickers?instType=SPOT', {
			referrerPolicy: "no-referrer",
			mode: 'no-cors',
		}),
		fetch('https://aws.okx.com/api/v5/market/tickers?instType=FUTURES', {
			referrerPolicy: "no-referrer",
			mode: 'no-cors',
		}),
		fetch('https://aws.okx.com/api/v5/market/tickers?instType=SWAP', {
			referrerPolicy: "no-referrer",
			mode: 'no-cors',
		}),
	]);

	const [spot, dated, perp]: Array<tickers> = await Promise.all(
		markets_promises.map((v) => v.json())
	);

	markets.push({
		exchange: 'OKX',
		market_type: 'spot',
		markets: spot.data.map((f) => f.instId)
	});
	markets.push({
		exchange: 'OKX',
		market_type: 'inverse',
		markets: dated.data.map((f) => f.instId)
	});
	markets.push({
		exchange: 'OKX',
		market_type: 'linear',
		markets: perp.data.map((f) => f.instId)
  });
  

  return markets
};
