/**
 * @description
 * unique
 */
export const unique = <T = unknown>(value: Iterable<T>) => {
  return Array.from(new Set(value));
};

/**
 * @description
 * unique by
 */
export const uniqueBy = <T, P>(value: Iterable<T>, callback: (item: T) => P) => {
  return Array.from(new Set(Array.from(value).map(callback)));
};
