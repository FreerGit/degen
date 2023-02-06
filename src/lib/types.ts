import type { DeleteLevel, Level, Side } from './bybit/order_book';

type Payload = Snapshot | Delta | Trades;

type Snapshot = {
	topic: string;
	type: string;
	data: OrderBook;
	cross_seq: number;
	timestamp_e6: number;
};

type OrderBook = {
	order_book: Array<Level>;
};

type Delta = {
	topic: string;
	type: string;
	data: Updates;
	cross_seq: number;
	timestamp_e6: number;
};

type Updates = {
	delete: Array<DeleteLevel>;
	update: Array<Level>;
	insert: Array<Level>;
};

type Direction = "PlusTick" | "MinusTick " | "ZeroMinusTick" | "ZeroPlusTick"

type Trades = {
	topic: string;
	data: Array<Trade>;
}

type Trade = {
	symbol: string;
	tick_direction: Direction;
	price: number;
	size: number;
	trade_time_ms: number;
	side: Side;
}

export type { Payload, Delta, Snapshot, Updates, Trades };
