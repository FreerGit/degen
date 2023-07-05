export const ExchangeValues = ['Bybit', 'Binance', 'OKX'] as const;

export type Exchange = (typeof ExchangeValues)[number];
