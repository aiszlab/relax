import type { Partialable } from "./partialable";

/**
 * @description `At` types
 */
export type At<T> = T extends string
  ? Partialable<string>
  : T extends Array<infer R>
  ? Partialable<R>
  : never;
