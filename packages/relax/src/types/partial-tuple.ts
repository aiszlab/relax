import type { Partialable } from "./partialable";

/**
 * @description
 * partial tuple
 */
export type PartialTuple<T extends unknown[]> = T extends [infer First, ...infer R]
  ? [Partialable<First>, ...PartialTuple<R>]
  : T;
