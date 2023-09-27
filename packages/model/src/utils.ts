import dayjs from "dayjs";

export const displayDate = (date: Date) => {
  return dayjs(date).format("MM/DD/YY");
};

export const formatDollarAmount = (amount: number): string => {
  const digits = Math.floor(amount).toString().split("").reverse();
  let str = "";
  for (let i = 0; i < digits.length; i++) {
    str = digits[i] + str;
    if (i % 3 === 2 && i > 0 && i < digits.length - 1) {
      str = "," + str;
    }
  }

  // There's got to be a better way to do this
  return `$${str}${(Math.round((amount - Math.floor(amount)) * 100) / 100)
    .toString()
    .slice(1)}`;
};

export const displayElapsedTime = (time: Date): string => {
	const currTime = new Date();
	const elapsedTime = currTime.getTime() - time.getTime();

	const second = 1000;
	const minute = 60000;
	const hour = 3600000;
	const day = 86400000;
	const week = 604800000;

	if (elapsedTime < minute) {
		return `${round(elapsedTime / second)}s ago`
	}

	if (elapsedTime < hour) {
		return `${round(elapsedTime / minute)}m ago`;
	}

	if (elapsedTime < day) {
		return `${round(elapsedTime / hour)}h ago`
	}

	if (elapsedTime < week) {
		return `${round(elapsedTime / day)}d ago`
	}

	return displayDate(time);
}

export const round = (value: number, digits = 0): number => {
	const places = Math.pow(10, digits);
	return Math.round(value * places) / places;
}

export const displayStorageSpace = (value: number): string => {
	if (value < 1000) {
		return `${value} B`;
	}

	if (value < 1000000) {
		return `${Math.round(value / 100) / 10} KB`;
	}

	if (value < 1000000000) {
		return `${Math.round(value / 100000) / 10} MB`
	}

	return `${Math.round(value / 100000000) / 10} GB`;
}

export const compare = (f1: string | number, f2: string | number): number => {
  if (typeof f1 === "string" && typeof f2 === "string") {
    return f1.localeCompare(f2);
  }

  if (typeof f1 === "number" && typeof f2 === "number") {
    return f1 - f2;
  }

  return 0;
};

export const getClass = (...strings: (string | undefined)[]) => {
  return strings.filter((x) => !!x).join(" ");
};

export const groupBy = function <T extends Pick<T, K>, K extends keyof T>(
  arr: T[],
  key: K,
) {
  return arr.reduce<Record<T[K], T[]>>((prev, curr) => {
    let a: T[] = [];
    const val = prev[curr[key]];
    if (val) {
      a = val;
    }
    a?.push(curr);
    prev[curr[key]] = a;

    return prev;
  }, {});
};

export const groupByDistinct = function <
  T extends Pick<T, K>,
  K extends keyof T,
>(arr: T[], key: K) {
  return arr.reduce<Record<T[K], T>>((prev, curr) => {
    if (prev[curr[key]]) {
      throw new DOMException("Each key value in the list must be unique");
    }

    prev[curr[key]] = curr;

    return prev;
  }, {});
};

export const groupTogether = function <T extends Pick<T, K>, K extends keyof T>(
  arr: T[],
  key: K,
) {
  const groups = groupBy(arr, key);

  return Object.keys(groups);
};

export const groupTogetherDistinct = function <
  T extends Pick<T, K>,
  K extends keyof T,
>(arr: T[], key: K): string[] {
  const groups = groupByDistinct(arr, key);

  return Object.keys(groups);
};

export function isDateInBetween(
  test: Date | null,
  start: Date | null,
  end: Date | null,
): boolean {
  if (test === null) {
    return true;
  }
  return (
    (start !== null ? start <= test : true) &&
    (end !== null ? test <= end : true)
  );
}
