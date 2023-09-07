export const formatDollarAmount = (amount: number) => {
	let str = '';
	const amountStr = amount.toString();
	for (let i = amountStr.length - 1; i >= 0; i--) {
		const digit = amountStr[i] as string;
		str = digit + str;

		const digitCount = amountStr.length - i;
		if (i > 0 && digitCount % 3 == 0) {
			str = ',' + str;
		}
	}

	return '$' + str;
}