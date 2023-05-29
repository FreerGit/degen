import type { MarketType } from './markets/get_markets';
import type { Exchange, Side } from './types';

export type RotateArray = {
	size: number;
	data: Array<Trade>;
};

export type Trade = {
	size: number;
	price: number;
	side: Side;
	type: MarketType;
	exchange: Exchange;
};

export const rotate_array = (size: number): RotateArray => {
	return { size, data: [] };
};

export const push_front = (arr: RotateArray, item: Trade) => {
	arr.data.unshift(item);
	trim_array(arr);
	return arr;
};

const trim_array = (arr: RotateArray) => {
	if (arr.data.length > arr.size) {
		const to_delete = arr.data.length - arr.size;
		return arr.data.splice(arr.data.length - to_delete, to_delete);
	}
};
