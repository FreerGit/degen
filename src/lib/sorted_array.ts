import type { Level } from './bybit/order_book';

const binary_search = (curr: Array<Level>, val: Level) => {
	for (let index = 0; index < curr.length; index++) {
		if (curr[index].price == val.price) {
			return index;
		}
	}
	return -1;
	// let start = 0;
	// let end = curr.length - 1;
	// if (end == -1) {
	//   return -1;
	// }
	// while (start <= end) {
	//   const middle = Math.floor((start + end) / 2);
	//   if (curr[middle].price === val.price) {
	// 		return middle;
	// 	} else if (curr[middle].price > val.price) {
	// 		start = middle + 1;
	// 	} else {
	// 		end = middle - 1;
	// 	}
	// }
	// return -1;
};

export const sorted_update = (curr: Array<Level>, val: Level) => {
	const idx = binary_search(curr, val);
	if (idx !== -1) {
		curr[idx] = val;
		// throw new Error('idx should never return -1 since level should exist.');
	}
};

export const sorted_insert = (curr: Array<Level>, val: Level) => {
	if (curr.length == 0) {
		curr.push(val);
	} else {
		if (curr[curr.length - 1].price > val.price) {
			curr.push(val);
		} else {
			for (let idx = 0; idx < curr.length; idx++) {
				if (curr[idx].price < val.price) {
					curr.splice(idx, 0, val);
					break;
				}
			}
		}
	}
};
