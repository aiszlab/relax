/**
 * @description
 * max
 */
function max(values: number[]): number;
function max<T>(values: T[], pipe: (value: T) => number): T;
function max<T>(values: T[], pipe?: (value: T) => number) {
  if (!pipe) {
    return Math.max(...(values as number[])) as T;
  }

  const _values = values.reduce<Map<number, T>>((prev, _value) => {
    const _key = pipe(_value);
    if (!prev.has(_key)) {
      prev.set(_key, _value);
    }
    return prev;
  }, new Map());

  const _max = Math.max(..._values.keys());

  return _values.get(_max)!;
}

export { max };
