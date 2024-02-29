/**
 * @description
 * in react, define some initial state always use a value getter
 */
export type StateGetter<T> = () => T

/**
 * @description
 * value or state setter
 */
export type State<T> = T | StateGetter<T>