import { isArray } from "../is/is-array";
import { isPrimitive } from "../is/is-primitive";

/**
 * @description
 * in develop, there are many cases to clone a string/number/object/array
 * this util is planning to resolve it
 */
export const clone = <T>(value: T): T => {
  if (isPrimitive(value)) return value;

  if (value instanceof Map) {
    // @ts-ignore
    return new Map(Array.from(value.entries()).map(([_key, _value]) => [_key, clone(_value)]));
  }

  if (value instanceof Set) {
    // @ts-ignore
    return new Set(Array.from(value.values()).map((_value) => clone(_value)));
  }

  if (isArray(value)) {
    // @ts-ignore
    return value.map((_value) => clone(_value));
  }

  // @ts-ignore
  return Object.entries(value).reduce((cloned, [_key, _value]) => {
    // @ts-ignore
    cloned[_key] = clone(_value);
    return cloned;
  }, {});
};
