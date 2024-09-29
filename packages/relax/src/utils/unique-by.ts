import { unique } from "./unique";

/**
 * @description
 * unique by
 */
export const uniqueBy = <T, P>(value: Iterable<T>, pipe?: (item: T) => P) => {
  if (!pipe) {
    return unique(value);
  }

  return Array.from(
    Array.from(value)
      .reduce((prev, _value) => {
        const _key = pipe(_value);
        if (!prev.has(_key)) {
          prev.set(pipe(_value), _value);
        }
        return prev;
      }, new Map())
      .values(),
  );
};
