import { isString } from "../is/is-string";
import { isVoid } from "../is/is-void";
import type { Voidable } from "../types";
import type { At } from "../types/at";

/**
 * @description for different browser or browser version, use good api to cover
 */
function at<T extends Array<unknown>>(value: Voidable<string | T>, index: number): At<T> {
  if (isVoid(value)) {
    return void 0 as At<T>;
  }

  if (isString(value)) {
    return value.at(index) as At<T>;
  }

  if (value.at) {
    return value.at(index) as At<T>;
  }

  return value[index] as At<T>;
}

export { at };
