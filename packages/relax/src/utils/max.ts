type MaxBy<T> = [values: T[], pipe: (value: T) => number];

/**
 * @description
 * max
 */
export const max = <T>(...args: MaxBy<T>): T => {
  const [values, pipe] = args;

  const _values = values.reduce<Map<number, T>>((prev, _value) => {
    const _key = pipe(_value);
    if (!prev.has(_key)) {
      prev.set(_key, _value);
    }
    return prev;
  }, new Map());

  const _max = Math.max(..._values.keys());

  return _values.get(_max)!;
};
