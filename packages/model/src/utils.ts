import dayjs from "dayjs";

export const displayDate = (date: Date) => {
	return dayjs(date).format('MM/DD/YY');
}

export const formatDollarAmount = (amount: number): string => {
	const digits = amount.toString().split('').reverse();
	let str = '';
	for (let i = 0; i < digits.length; i++) {
		str = digits[i] + str;
		if (i % 3 === 0 && i > 0 && i < digits.length - 1) {
			str = ',' + str;
		}
	}

	return '$' + str;
}