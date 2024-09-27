/**
 * @description
 * unique
 */
export const unique = <T = unknown>(...values: Array<Iterable<T>>) => {
  return Array.from(
    values.reduce<Set<T>>((unionize, _value) => unionize.union(new Set(_value)), new Set()),
  );
};
