import type { markets_per_exchange, market_at_exchange, market_type } from "$lib/markets/get_markets";

type tickers = {
  result: category;
}

type category = {
  category: market_type,
  list: Array<ticker>,
}

type ticker = {
  symbol: string;
}

export const get_bybit_markets = async (): Promise<markets_per_exchange> => {
  let markets: markets_per_exchange = [];
  const markets_promises = await Promise.all([
    fetch("https://api.bybit.com/v5/market/tickers?category=spot"),
    fetch("https://api.bybit.com/v5/market/tickers?category=linear"),
    fetch("https://api.bybit.com/v5/market/tickers?category=inverse")
  ]);

  const [spot, linear, inverse] : Array<tickers> =
    await Promise.all(markets_promises.map(v => v.json()));
  
  markets.push({
    exchange: "Bybit",
    market_type: "spot",
    markets: spot.result.list.map(f => f.symbol)
  });
  markets.push({
    exchange: "Bybit",
    market_type: "linear",
    markets: linear.result.list.map(f => f.symbol)
  });
  markets.push({
    exchange: "Bybit",
    market_type: "inverse",
    markets: inverse.result.list.map(f => f.symbol)
  });

  return markets;
}