/**
 * @description
 * min
 */
function min(values: number[]): number;
function min<T>(values: T[], pipe: (value: T) => number): T;
function min<T>(values: T[], pipe?: (value: T) => number): T {
  if (!pipe) {
    return Math.min(...(values as number[])) as T;
  }

  const _values = values.reduce<Map<number, T>>((prev, _value) => {
    const _key = pipe(_value);
    if (!prev.has(_key)) {
      prev.set(_key, _value);
    }
    return prev;
  }, new Map());

  const _min = Math.min(..._values.keys());

  return _values.get(_min)!;
}

export { min };
