enum Side {
  Buy,
  Sell
}

type Level = {
  price: number,
  symbol: string,
  side: Side,
  size: number
}


export type {Level, Side}