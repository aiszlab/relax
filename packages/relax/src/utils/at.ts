import { isString } from "../is/is-string";
import type { Partialable } from "../types";

/**
 * @description for different browser or browser version, use good api to cover
 */
function at(value: string, index: number): string;
function at<T>(value: Array<T>, index: number): Partialable<T>;
function at<T>(value: string | Array<T>, index: number) {
  if (isString(value)) {
    return value.at(index);
  }

  // @ts-expect-error Can i use `at`
  if (Array.prototype.at) {
    return value.at(index);
  }

  return value[index];
}

export { at };
