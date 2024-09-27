import { type Last } from "@aiszlab/relax/types";
import { toArray } from "./to-array";

/**
 * @description
 * last element of array
 */
export const last = <T = unknown>(value: T): Last<T, T> => {
  // @ts-ignore
  return toArray(value, { separator: "" }).at(-1);
};
