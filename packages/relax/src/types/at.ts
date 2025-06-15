import { Partialable } from "./partialable";

/**
 * At
 */
export type At<T> = T extends string ? Partialable<string> : T extends Array<infer R> ? R : never;
