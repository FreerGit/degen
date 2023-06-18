import type { Level } from './order_book';

export type Payload = Snapshot | Delta | Trades | Connection;

export type Ok = {
	id: number;
	result: null;
};

export type BinanceTrade = {
	e: string;
	p: number;
	q: number;
	m: boolean;
};

export type OrderBook_ = {
	a: Array<Level>;
	b: Array<Level>;
	s: string;
};

export type OrderBook = {
	asks: Array<Level>;
	bids: Array<Level>;
	s: string;
};
