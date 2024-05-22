import { Waitable } from '../waitable'
import type { Debounced, Debouncer } from '../debounce'
import { isFunction } from '../../is/is-function'
import { type Callable } from '../../hooks/use-event'
import { throttleTime } from 'rxjs'

export type Throttled<T extends Callable> = Debounced<T>

export type Throttler<T extends Callable, R extends Array<unknown> = Parameters<T>> = Debouncer<T, R>

export const throttle = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  throttler: Throttler<T, R> | T,
  wait: number
): Throttled<T> => {
  const isCallable = isFunction(throttler)
  const callback = isCallable ? throttler : throttler.callback
  const pipe = isCallable ? (...args: Parameters<T>) => args as unknown as R : throttler.pipe

  const waiter = new Waitable({
    callback,
    pipe,
    timer: throttleTime(wait)
  })

  return {
    next: (...args: Parameters<T>) => waiter.next(...args),
    flush: () => waiter.flush(),
    abort: () => waiter.abort()
  }
}
