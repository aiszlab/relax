import { type First } from "@aiszlab/relax/types";
import { toArray } from "./to-array";

/**
 * @description
 * first element of array
 */
export const first = <T = unknown>(value: T) => {
  return toArray(value).at(0) as First<T, T>;
};
