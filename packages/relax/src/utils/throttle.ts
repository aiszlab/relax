import { type Debounced, Trigger, type Debouncer } from './debounce'
import { isFunction } from '../is/is-function'
import { type Callable } from '../hooks/use-event'

export type Throttled<T extends Callable> = Debounced<T>

export type Throttler<T extends Callable, R extends Array<unknown> = Parameters<T>> = Debouncer<T, R>

export const throttle = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  throttler: Throttler<T, R> | T,
  duration: number
): Throttled<T> => {
  const _isFunction = isFunction(throttler)
  const trigger = new Trigger<T, R>(
    {
      callback: _isFunction ? throttler : throttler.callback,
      pipeable: _isFunction ? null : throttler.pipeable
    },
    duration,
    'throttle'
  ).use()

  return {
    next: (...args: Parameters<T>) => trigger.next(...args),
    flush: () => trigger.flush(),
    abort: () => trigger.abort()
  }
}
