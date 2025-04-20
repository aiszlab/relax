import { type First } from "@aiszlab/relax/types";
import { toArray } from "./to-array";
import { at } from "./at";
import { isString } from "../is/is-string";

/**
 * @description
 * first element of array
 */
export const first = <T = unknown>(value: T): First<T, T> => {
  if (isString(value)) {
    return value.at(0) as First<T, T>;
  }

  return at(toArray(value) as unknown[], 0) as First<T, T>;
};
