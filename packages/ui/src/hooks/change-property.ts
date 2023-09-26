interface ChangePropertyType<T> {
  <K extends keyof T>(item: T, key: K, value: T[K]): T;
  function: (item: T) => void;
}
export const useChangeProperty = <T>(
  func: (item: T) => void,
): ChangePropertyType<T> => {
  const ret: ChangePropertyType<T> = <K extends keyof T>(
    item: T,
    key: K,
    value: T[K],
  ): T => {
    const copy = { ...item };
    copy[key] = value;

    func(copy);

    return copy;
  };
  ret.function = func;

  return ret;
};
