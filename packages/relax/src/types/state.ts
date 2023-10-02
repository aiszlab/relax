export type StateGetter<T> = () => T

/**
 * @description
 * state setter
 *
 * used by initial state, default state, controlled state
 */
export type State<T> = T | StateGetter<T>
