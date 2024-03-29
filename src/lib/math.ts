export const number_as_k = (num: number, fixed: number): string => {
	if (num >= 1000) {
		return `${(num / 1000).toFixed(fixed)}k`;
	} else if (num <= -1000) {
		return `${(num / 1000).toFixed(fixed)}k`;
	} else {
		if (typeof num === 'number') {
			return `${num.toFixed(fixed)}`;
		}
		return num;
	}
};
