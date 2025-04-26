import { isString } from "../is/is-string";
import type { Partialable } from "../types";

/**
 * @description for different browser or browser version, use good api to cover
 */
function at(value: string, pos: number): string;
function at<T>(value: Array<T>, pos: number): Partialable<T>;
function at<T>(value: string | Array<T>, pos: number) {
  if (isString(value)) {
    return value.at(pos);
  }

  // @ts-expect-error Can i use `at`
  if (Array.prototype.at) {
    return value.at(pos);
  }

  return value[pos];
}

export { at };
