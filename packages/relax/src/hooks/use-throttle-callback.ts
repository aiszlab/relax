import { useEffect, useMemo, useRef } from 'react'
import { throttle, type Throttler, type Throttled } from '../utils/throttle'
import { type Callable, useEvent } from './use-event'
import { isFunction } from '../is/is-function'
import { useDefault } from '../hooks/use-default'

const useThrottler = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  debouncer: T | Throttler<T, R>
): Throttler<T, R> => {
  const _debouncer = useMemo(() => {
    return isFunction(debouncer) ? { callback: debouncer, pipeable: null } : debouncer
  }, [debouncer])

  return {
    callback: useEvent((...args) => {
      return _debouncer.callback(...args)
    }),
    pipeable: useEvent((...args: Parameters<T>) => {
      return _debouncer.pipeable?.(...args) ?? args
    })
  }
}

/**
 * @author murukal
 *
 * @description
 * throttle callback
 *
 * @param callback
 * @param duration number
 * @description
 * The duration time (in milliseconds) until the throttle function is called.
 * default 1000
 *
 * @example
 * 1000
 */
export const useThrottleCallback = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  throttler: T | Throttler<T, R>,
  duration: number = 1000
) => {
  const throttled = useRef<Throttled<T> | null>(null)
  const { callback, pipeable } = useThrottler(throttler)

  useEffect(() => {
    const _throttled = throttle<T, R>(
      {
        callback,
        pipeable
      },
      duration
    )
    throttled.current = _throttled

    // dispose
    return () => {
      _throttled.abort()
      throttled.current = null
    }
  }, [duration])

  return useDefault(() => ({
    next: (...args: Parameters<T>) => throttled.current?.next(...args),
    flush: () => throttled.current?.flush(),
    abort: () => throttled.current?.abort()
  }))
}
