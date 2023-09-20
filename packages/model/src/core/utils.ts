export type AllOrNothing<T> =
  | T
  | {
      [P in keyof T]?: undefined;
    };
