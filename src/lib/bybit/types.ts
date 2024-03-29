import type { MarketType } from '$lib/markets/get_markets';
import type { Level } from './order_book';

export type Payload = Snapshot | Delta | Trades | Connection;

export type Connection = {
	success: boolean;
	request: string;
};

export type Snapshot = {
	topic: string;
	type: string;
	data: OrderBook;
	ts: number;
};

export type OrderBook = {
	a: Array<Level>;
	b: Array<Level>;
	s: string;
};

export type Delta = {
	topic: string;
	type: string;
	data: OrderBook;
	ts: number;
};

export type Side = 'Buy' | 'Sell';

export type Direction = 'PlusTick' | 'MinusTick ' | 'ZeroMinusTick' | 'ZeroPlusTick';

export type Trades = {
	topic: string;
	ts: number;
	data: Array<Trade>;
};

export type Trade = {
	T: number;
	s: string;
	S: Side;
	v: number;
	p: number;
	L: Direction;
	type: MarketType;
	// trade_time_ms: number;
};
