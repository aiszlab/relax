import { type First } from "@aiszlab/relax/types";
import { toArray } from "./to-array";

/**
 * @description
 * first element of array
 */
export const first = <T = unknown>(value: T): First<T, T> => {
  // @ts-ignore
  return toArray(value, { separator: "" }).at(0);
};
