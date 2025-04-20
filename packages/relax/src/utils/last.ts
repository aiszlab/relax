import { type Last } from "@aiszlab/relax/types";
import { toArray } from "./to-array";
import { isString } from "../is/is-string";
import { at } from "./at";

/**
 * @description
 * last element of array
 */
export const last = <T = unknown>(value: T): Last<T, T> => {
  if (isString(value)) {
    return value.at(-1) as Last<T, T>;
  }

  return at(toArray(value) as unknown[], -1) as Last<T, T>;
};
