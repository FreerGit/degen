import type { Level } from './bybit/order_book';

const binary_search = (curr: Array<Level>, val: Level) => {
	for (let index = 0; index < curr.length; index++) {
		if (curr[index][0] == val[0]) {
			return index;
		}
	}
	return -1;
};

export const sorted_update = (curr: Array<Level>, val: Level) => {
	const idx = binary_search(curr, val);
	if (idx !== -1) {
		curr[idx] = val;
	}
};

export const sorted_insert = (curr: Array<Level>, val: Level) => {
	if (curr.length == 0) {
		curr.push(val);
	} else {
		if (curr[curr.length - 1][0] > val[0]) {
			curr.push(val);
		} else {
			for (let idx = 0; idx < curr.length; idx++) {
				if (curr[idx][0] < val[0]) {
					curr.splice(idx, 0, val);
					break;
				}
			}
		}
	}
};
