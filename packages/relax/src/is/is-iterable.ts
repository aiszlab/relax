import { isFunction } from "./is-function";

/**
 * is iterable
 */
function isIterable(value: unknown): value is Iterable<unknown> {
  return isFunction((value as any)?.[Symbol.iterator]);
}

export { isIterable };
