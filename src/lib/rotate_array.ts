import type { Trade } from './types';

type rotate_array = {
	size: number;
	data: Array<Trade>;
};

export const rotate_array = (size: number): rotate_array => {
	return { size, data: [] };
};

export const push_front = (arr: rotate_array, items: Array<Trade>) => {
	items.forEach((i) => arr.data.unshift(i));
	trim_array(arr);
	return arr;
};

const trim_array = (arr: rotate_array) => {
	if (arr.data.length > arr.size) {
		const to_delete = arr.data.length - arr.size;
		return arr.data.splice(arr.data.length - to_delete, to_delete);
	}
};
