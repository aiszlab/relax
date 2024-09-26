/**
 * @description
 * unique
 */
export const unique = <T = unknown>(...values: Array<Iterable<T>>) => {
  return Array.from(
    values.reduce<Set<T>>((unionize, _value) => unionize.union(new Set(_value)), new Set()),
  );
};

/**
 * @description
 * unique by
 */
export const uniqueBy = <T, P>(value: Iterable<T>, callback: (item: T) => P) => {
  return Array.from(new Set(Array.from(value).map(callback)));
};
