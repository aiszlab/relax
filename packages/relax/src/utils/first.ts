import { type First } from "@aiszlab/relax/types";
import { toArray } from "./to-array";
import { at } from "./at";
import { isString } from "../is/is-string";
import { isVoid } from "../is/is-void";

/**
 * @description
 * first element of array
 */
export const first = <T = unknown>(value: T): First<T> => {
  if (isVoid(value)) {
    return void 0 as First<T>;
  }

  if (isString(value)) {
    return at(value, 0) as First<T>;
  }

  return at(toArray(value) as unknown[], 0) as First<T>;
};
