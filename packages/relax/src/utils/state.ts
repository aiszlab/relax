import type { State, StateGetter } from '../types/state'

/**
 * @description
 * is function
 */
export const isFunction = <T>(state: State<T>): state is StateGetter<T> => {
  return typeof state === 'function'
}

/**
 * @description
 * is undefined
 */
export const isVoid = (value: unknown): value is undefined => {
  return value === void 0
}
