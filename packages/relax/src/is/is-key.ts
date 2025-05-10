import { isArray } from "./is-array";
import { isBoolean } from "./is-boolean";
import { isNull } from "./is-null";
import { isNumber } from "./is-number";
import { isObject } from "./is-object";
import { isString } from "./is-string";
import { isSymbol } from "./is-symbol";

/**  Matches any deep property path. (e.g. `a.b[0].c`)*/
const _IS_DEEP_KEY = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
/**  Matches any word character (alphanumeric & underscore).*/
const _IS_PLAIN_KEY = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path. (It's ok that the `value` is not in the keys of the `object`)
 * @param {unknown} value The value to check.
 * @param {unknown} object The object to query.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 *
 * @example
 * isKey('a', { a: 1 });
 * // => true
 *
 * isKey('a.b', { a: { b: 2 } });
 * // => false
 */
export function isKey(value?: unknown, object?: unknown): value is PropertyKey {
  if (isArray(value) || isObject(value)) {
    return false;
  }

  if (isNumber(value) || isBoolean(value) || isNull(value) || isSymbol(value)) {
    return true;
  }

  return (
    (isString(value) && (_IS_PLAIN_KEY.test(value) || !_IS_DEEP_KEY.test(value))) ||
    (object != null && Object.hasOwn(object, value as unknown as PropertyKey))
  );
}
