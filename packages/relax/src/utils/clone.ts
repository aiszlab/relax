import { isArray } from "../is/is-array";
import { isFunction } from "../is/is-function";
import { isMap } from "../is/is-map";
import { isPrimitive } from "../is/is-primitive";
import { isSet } from "../is/is-set";

/**
 * @description
 * in develop, there are many cases to clone a string/number/object/array
 * this util is planning to resolve it
 */
export const clone = <T>(value: T): T => {
  if (isPrimitive(value)) return value;

  // function is not clonable
  if (isFunction(value)) return value;

  // map clone
  if (isMap(value)) {
    return new Map(Array.from(value.entries()).map(([_key, _value]) => [_key, clone(_value)])) as T;
  }

  if (isSet(value)) {
    return new Set(Array.from(value.values()).map((_value) => clone(_value))) as T;
  }

  if (isArray(value)) {
    return value.map((_value) => clone(_value)) as T;
  }

  return Object.entries(value as Record<string, unknown>).reduce<Record<string, unknown>>(
    (cloned, [_key, _value]) => {
      cloned[_key] = clone(_value);
      return cloned;
    },
    {},
  ) as T;
};
