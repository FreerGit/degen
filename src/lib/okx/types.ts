export type Payload = Delta | Trades | Connection;

export type Connection = {
	event: string;
	arg: Arg;
};

export type Arg = {
	channel: string;
	instId: string;
};

export type Side = 'buy' | 'sell';

export type Trade = {
	px: number;
	sz: number;
	side: Side;
};

export type Trades = {
	arg: Arg;
	data: Array<Trade>;
};

export type Level = [string, string, string, string];

export type Update = {
	asks: Array<Level>;
	bids: Array<Level>;
};

export type Delta = {
	arg: Arg;
	action: string;
	data: Array<Update>;
};
