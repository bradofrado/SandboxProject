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
