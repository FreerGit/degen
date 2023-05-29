import type { MarketType } from "$lib/markets/get_markets";
import { push_front } from "$lib/rotate_array";
import type { TradeFeed } from "$lib/trade_feed";
import { match, P } from "ts-pattern";



type Payload = BinanceTrade | Ok

type Ok = {
  id: number,
  result: null
}

type BinanceTrade = {
  e: string,
  p: number,
  q: number,
  m: boolean,
}

const buy_or_sell = (m: boolean) => {
  if (m) return 'Sell'
  else return 'Buy'
} 

export const handle_binance_trade_message = (feed: TradeFeed, msg: string, type: MarketType) => {
  const trade: Payload = JSON.parse(msg);
  match(trade)
    .with({ e: P.string }, (t) => {
        if (type == 'inverse') {
          if (+t.q > feed.min_size) {
            feed.trades = push_front(feed.trades, {
              price: t.p,
              size: t.q,
              side: buy_or_sell(t.m),
              type: type,
              exchange: 'Binance'
            });
          }
        } else {
          if (t.q * t.p > feed.min_size) {
            feed.trades = push_front(feed.trades, {
              price: t.p,
              size: t.q,
              side: buy_or_sell(t.m),
              type: type,
              exchange: 'Binance'
            });
          }
        }
      })
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    .with({ id: P.number, result: P.nullish }, () => {})
    .run();
}