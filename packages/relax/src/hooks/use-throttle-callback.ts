import { useCallback, useEffect, useRef } from 'react'
import { Observable, Subscriber, Subscription, throttleTime } from 'rxjs'

interface Options {
  /**
   * The delay time (in milliseconds) until the throttle function is called.
   * default 1000
   */
  readonly duration: number
}

/**
 * @author murukal
 *
 * @description
 * throttle callback
 */
export const useThrottleCallback = <T>(
  callable: Function,
  { duration = 1000 }: Options = {
    duration: 1000
  }
) => {
  // runner
  const runner = useRef<Subscriber<T>>()
  // listener
  const listener = useRef<Subscription>()

  /// initialze listener function for debouce
  const initialize = useCallback(() => {
    listener.current = new Observable<T>((subscriber) => {
      runner.current = subscriber
    })
      .pipe(throttleTime(duration))
      .subscribe({
        next: (value) => {
          callable(value)
        },
        complete: () => {
          initialize()
        }
      })
  }, [callable, duration])

  /// initialize debounce function
  /// when delay / callable changed, need reinitialize
  useEffect(() => {
    initialize()

    // dispose
    return () => {
      listener.current?.unsubscribe()
    }
  }, [initialize])

  /// next function has been debounced for hooks user
  const next = useCallback((value: T) => {
    runner.current?.next(value)
  }, [])

  /// flush the debounce
  const complete = useCallback(() => {
    runner.current?.complete()
  }, [])

  /// cancel only valid in debounce time
  /// if the callback has been called, it can not be canceled
  const cancel = useCallback(() => {
    listener.current?.unsubscribe()
  }, [])

  return {
    next,
    complete,
    cancel
  }
}
