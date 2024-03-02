import { useEffect, useMemo, useRef } from 'react'
import { throttle, type Throttled } from '../utils/throttle'
import { useEvent } from './use-event'
import type { Arguments, First } from '../types'

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
export const useThrottleCallback = <T extends Function>(callback: T, duration: number = 1000) => {
  const trigger = useRef<Throttled<T> | null>(null)
  const callable = useEvent(callback)

  useEffect(() => {
    const throttled = throttle(callable, duration)
    trigger.current = throttled

    // dispose
    return () => {
      throttled.cancel()
      trigger.current = null
    }
  }, [duration])

  const throttled = useMemo<Throttled<T>>(
    () => ({
      next: (value: First<Arguments<T>>) => trigger.current?.next(value),
      complete: () => trigger.current?.complete(),
      cancel: () => trigger.current?.cancel()
    }),
    []
  )

  return throttled
}
