export const useChangeProperty = <T,>(func: (item: T) => void) => {
	const ret = <K extends keyof T>(item: T, key: K, value: T[K]): T => {
		const copy = {...item};
		copy[key] = value;

		func(copy);

		return copy;
	}
	ret.function = func;

	return ret;
}