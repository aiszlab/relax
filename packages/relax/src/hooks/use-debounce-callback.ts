import { useEffect, useMemo, useRef } from 'react'
import { debounce, type Debounced } from '../utils/debounce'
import { useEvent } from './use-event'
import { useDefault } from './use-default'

/**
 * @author murukal
 *
 * @description
 * debounce callback
 *
 * @param callback
 * @param wait number
 * @description
 * The delay time (in milliseconds) until the debounce function is called.
 * default 1000
 *
 * @example
 * 1000
 */
export const useDebounceCallback = <T>(callback: Debounced<T>['next'], wait: number = 1000) => {
  const trigger = useRef<Debounced<T> | null>(null)
  const callable = useEvent(callback)

  useEffect(() => {
    const debounced = debounce(callable, wait)
    trigger.current = debounced

    // dispose
    return () => {
      debounced.cancel()
      trigger.current = null
    }
  }, [wait])

  const debounced = useDefault<Debounced<T>>(() => ({
    next: (value: T) => trigger.current?.next(value),
    complete: () => trigger.current?.complete(),
    cancel: () => trigger.current?.cancel()
  }))

  return debounced
}
