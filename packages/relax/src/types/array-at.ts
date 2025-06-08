/**
 * item type of array
 */
export type ArrayAt<T> = T extends Array<infer I> ? I : never;
