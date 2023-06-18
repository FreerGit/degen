# Tasks

## smol

Feeds should not render as chunks of list but rather singles, maybe stagger? - has to be smoother
colors based on difference from min - tresholds or only min size

## Next

ctrl F for @TODO HERE

## Large

- [ ] switch to v5 bybit api use exchange.ts

- [ ] liq feed
- [ ] options for liq feed
- [ ] trades delta over time
- [ ] make both feeds removeable (only bybit)
- [ ] make both feeds addable (only bybit)
- [ ] make order books addable (only bybit)
- [ ] make order books removable (only bybit)
- [ ] polish feeds
- [ ] polish order book
- [ ] add coinbase order books
- [ ] add coinbase liq feed
- [ ] add coinbase trade feed
- [ ] make settings savable - local storage

## UI work

- [ ] Make the drag icon on the orderbook larger and white
- [ ] Trade feed should be scaling color from min

## Bugs

- [ ] Trade feed filter removes same symbol for all exchanges on select

## Issues

Speedup: in binance book, change all to strings instead of numbers, have to convert everytime otherwise
Speedup: in trade feed, have a static value that you clear and write too instead of copying

## Layout

Maybe resizable windows later for OB and feeds but for now just have sized windows with layout config
