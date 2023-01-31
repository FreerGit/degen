import type { DeleteLevel, Level } from './bybit/order_book';

type Payload = Snapshot | Delta;

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

export type { Payload, Delta, Snapshot, Updates };