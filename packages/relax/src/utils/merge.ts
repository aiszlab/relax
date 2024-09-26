import { isArray } from "../is/is-array";
import { isFunction } from "../is/is-function";
import { isPrimitive, type Primitive } from "../is/is-primitive";
import { clone } from "./clone";
import { unique } from "./unique";

interface _Object extends Record<string | number | symbol, _Value> {}

interface _Array extends Array<_Value> {}

type _Value = _Array | _Object | Primitive | Function;

const _merge = (previous: _Value, next: _Value) => {
  if (
    isPrimitive(previous) ||
    isPrimitive(next) ||
    isFunction(previous) ||
    isFunction(next) ||
    previous === next
  ) {
    return clone(next);
  }

  const _previous = new Map(Object.entries(previous));
  const _next = new Map(Object.entries(next));
  const _uniqueKeys = unique(_previous.keys(), _next.keys());

  const merged = _uniqueKeys.reduce<Record<string, _Value>>((_merged, _key) => {
    const _previousValue = _previous.get(_key);
    const _nextValue = _next.get(_key);

    if (!_next.has(_key)) {
      _merged[_key] = clone(_previousValue);
      return _merged;
    }

    // deep merge child value
    _merged[_key] = _merge(_previousValue, _nextValue);
    return _merged;
  }, {});

  // convert value type same as previous
  // if `previous` is object, use merged object directly
  if (!isArray(previous)) return merged;

  // else `previous` is array, check next value type
  // but length will be merged when next value is array
  return Array.from<_Array>({
    ...merged,
    length: isArray(next) ? Object.keys(merged).length : previous.length,
  });
};

/**
 * @description
 * deep merge api
 * use unique values to avoid duplicate
 */
const merge = <T>(...values: [T, ...unknown[]]): T => {
  // @ts-ignore
  return unique(values).reduce((_merged, _value) => {
    // @ts-ignore
    return _merge(_merged, _value ?? {});
  }, null);
};

export { merge };
