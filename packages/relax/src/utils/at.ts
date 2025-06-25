import { isString } from "../is/is-string";
import type { At } from "../types/at";

/**
 * @description for different browser or browser version, use good api to cover
 */
function at<T>(value: string | ReadonlyArray<T>, index: number): At<T> {
  if (isString(value)) {
    return value.at(index) as At<T>;
  }

  // @ts-expect-error Can i use `at`
  if (Array.prototype.at) {
    return value.at(index) as At<T>;
  }

  return value[index] as At<T>;
}

export { at };
