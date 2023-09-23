import dayjs from "dayjs";

export const displayDate = (date: Date) => {
	return dayjs(date).format('MM/DD/YY');
}

export const formatDollarAmount = (amount: number): string => {
	const digits = Math.floor(amount).toString().split('').reverse();
	let str = '';
	for (let i = 0; i < digits.length; i++) {
		str = digits[i] + str;
		if (i % 3 === 2 && i > 0 && i < digits.length - 1) {
			str = ',' + str;
		}
	}

	// There's got to be a better way to do this
	return `$${str}${(Math.round((amount - Math.floor(amount)) * 100) / 100).toString().slice(1)}`;
}

export const compare = (f1: string | number, f2: string | number): number => {
	if (typeof f1 === 'string' && typeof f2 === 'string') {
		return f1.localeCompare(f2);
	}

	if (typeof f1 === 'number' && typeof f2 === 'number') {
		return f1 - f2;
	}

	return 0;
}