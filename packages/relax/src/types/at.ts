import { Partialable } from "./partialable";

/**
 * `At` types
 */
export type At<T> = T extends string
  ? Partialable<string>
  : T extends ReadonlyArray<infer R>
  ? R
  : never;
