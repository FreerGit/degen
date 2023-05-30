export const ExchangeValues = ['Bybit', 'Binance'] as const;

export type Exchange = (typeof ExchangeValues)[number];
