import { get_bybit_markets } from "$lib/bybit/get_market";
import type { Exchange } from "$lib/types";

export type market_type = "spot" | "linear" | "option" | "inverse";

export type markets_per_exchange = Array<market_at_exchange>;

export type market_at_exchange = {
  exchange: Exchange;
  market_type: market_type,
  markets: Array<string>
}

export const get_markets = async (): Promise<markets_per_exchange> => {
  return await get_bybit_markets();
}

