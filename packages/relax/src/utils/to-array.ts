import { isArray } from "../is/is-array";
import { isIterable } from "../is/is-iterable";
import { isString } from "../is/is-string";
import { isVoid } from "../is/is-void";

type ToArrayReturn<T> = T extends null
  ? never[]
  : T extends undefined
  ? never[]
  : T extends string
  ? T[]
  : T extends Array<infer R>
  ? R[]
  : T extends Iterable<infer I>
  ? I[]
  : T[];

/**
 * @description
 * convert any type data to a array
 */
function toArray<T extends unknown = unknown>(value: T): ToArrayReturn<T> {
  // in `void` case, just return empty array
  if (isVoid(value)) {
    return [] as ToArrayReturn<typeof value>;
  }

  // already is `Array`
  if (isArray(value)) {
    return value as ToArrayReturn<typeof value>;
  }

  // has iterator
  // `string` to `[string]`
  if (isIterable(value) && !isString(value)) {
    return Array.from(value) as ToArrayReturn<typeof value>;
  }

  return [value] as ToArrayReturn<typeof value>;
}

export { toArray };
