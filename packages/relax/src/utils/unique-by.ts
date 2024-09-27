import { unique } from "./unique";

/**
 * @description
 * unique by
 */
export const uniqueBy = <T, P>(value: Iterable<T>, callback?: (item: T) => P) => {
  if (!callback) {
    return unique(value);
  }

  return Array.from(
    Array.from(value)
      .reduce((prev, _value) => {
        const _key = callback(_value);
        if (!prev.has(_key)) {
          prev.set(callback(_value), _value);
        }
        return prev;
      }, new Map())
      .values(),
  );
};
