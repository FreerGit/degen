type Payload = Trade | Delta;

type Ok = {
	id: number;
	result: null;
};

type BinanceTrade = {
	e: string;
	p: number;
	q: number;
	m: boolean;
};
