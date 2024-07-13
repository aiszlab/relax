import type { Partialable } from "./partialable";
import type { Nullable } from "./nullable";

/**
 * @description
 * void able
 */
export type Voidable<T> = Partialable<Nullable<T>>;
