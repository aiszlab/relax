import { isString } from "../is/is-string";
import { toArray } from "./to-array";

type StringReplacing = [searchValue: string, incoming: string];
type ArrayReplacing<T> = [incoming: Array<T> | T, start: number, end?: number];

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

function replace<T>(value: string | Array<T>, ...args: unknown[]) {
  if (isString(value)) {
    return value.replace(...(args as StringReplacing));
  }

  const { 0: incoming, 1: start, 2: end } = args as ArrayReplacing<unknown>;
  const _incomings = toArray(incoming);

  const leading = value.slice(0, start);
  const trailing = value.slice(end ?? start + _incomings.length);

  return [...leading, ..._incomings, ...trailing];
}

export { replace };
