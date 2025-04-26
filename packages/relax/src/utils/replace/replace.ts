import { isString } from "../../is/is-string";

type StringReplacing = [searchValue: string, replaceValue: string];
type ArrayReplacing<T> = [searchValue: T, replaceValue: T];

/**
 * @description
 * string replace.
 * it is an easy way to replace string.
 * wrapper for `String.prototype.replace`.
 */
function replace(value: string, ...args: StringReplacing): string;

/**
 * @description
 * replace array.
 * `value`, `incoming` should be array.
 * [start, end)
 */
function replace<T>(value: Array<T>, ...args: ArrayReplacing<T>): Array<T>;

function replace<T>(value: string | Array<T>, ...args: StringReplacing | ArrayReplacing<T>) {
  if (isString(value)) {
    return value.replace(...(args as StringReplacing));
  }

  const { 0: searchValue, 1: incoming } = args as ArrayReplacing<unknown>;

  return (value as Array<T>).map((_v) => {
    return _v === searchValue ? incoming : _v;
  });
}

export { replace };
