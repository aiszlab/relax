type StateGetter<T> = () => T

/**
 * @description
 * state setter
 *
 * used by initial state, default state, controlled state
 */
export type State<T> = T | StateGetter<T>

/**
 * @description
 * is state getter
 */
export const isStateGetter = <T>(state: State<T>): state is StateGetter<T> => {
  return typeof state === 'function'
}
