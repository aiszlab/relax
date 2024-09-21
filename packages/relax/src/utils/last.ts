import { type Last } from "../types";
import { toArray } from "./to-array";

/**
 * @description
 * last element of array
 */
export const last = <T = unknown>(value: T) => {
  return toArray(value).at(-1) as Last<T, T>;
};
