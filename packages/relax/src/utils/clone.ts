import { isArray } from "../is/is-array";
import { isPrimitive } from "../is/is-primitive";

/**
 * @description
 * in develop, there are many cases to clone a string/number/object/array
 * this util is planning to resolve it
 */
export const clone = (value: unknown) => {
  if (isPrimitive(value)) return value;

  if (value instanceof Map) return new Map(value);

  if (value instanceof Set) return new Set(value);

  if (isArray(value)) return Array.from(value);

  return Object(value);
};
