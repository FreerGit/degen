import type { Trade } from './types';

export class TradeFeed {}

export type RotateArray = {
	size: number;
	data: Array<Trade>;
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
