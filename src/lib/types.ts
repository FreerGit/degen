import type { DeleteLevel, Level, Side } from './bybit/order_book';

export type Payload = Snapshot | Delta | Trades;

export type Snapshot = {
	topic: string;
	type: string;
	data: OrderBook;
	cross_seq: number;
	timestamp_e6: number;
};

export type OrderBook = {
	order_book: Array<Level>;
};

export type Delta = {
	topic: string;
	type: string;
	data: Updates;
	cross_seq: number;
	timestamp_e6: number;
};

export type Updates = {
	delete: Array<DeleteLevel>;
	update: Array<Level>;
	insert: Array<Level>;
};

export type Direction = 'PlusTick' | 'MinusTick ' | 'ZeroMinusTick' | 'ZeroPlusTick';

export type Trades = {
	topic: string;
	data: Array<Trade>;
};

export type Trade = {
	symbol: string;
	tick_direction: Direction;
	price: number;
	size: number;
	trade_time_ms: number;
	side: Side;
};

export const ExchangeValues = ['Bybit', 'Binance'] as const;

export type Exchange = typeof ExchangeValues[number];
