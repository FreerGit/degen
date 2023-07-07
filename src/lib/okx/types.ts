export type Payload = Trades | Connection;

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
