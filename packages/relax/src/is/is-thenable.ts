/**
 * @description
 * is thenable
 */
export const isThenable = <T>(value: T | PromiseLike<T>): value is PromiseLike<T> => {
  return value instanceof Promise || !!(value as PromiseLike<T>)?.then
}
