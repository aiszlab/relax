import { useCallback, useEffect, useRef } from 'react'
import { Observable, Subscriber, Subscription, debounceTime } from 'rxjs'

interface Options {
  /**
   * The delay time (in milliseconds) until the debounce function is called.
   * default 1000
   */
  readonly delay: number
}

/**
 * @author murukal
 * @description 防抖hooks
 */
export const useDebounceCallback = <T>(callable: Function, options: Options) => {
  // delay
  const delay = options.delay ?? 1000
  // runner
  const runner = useRef<Subscriber<T>>()
  // listener
  const listener = useRef<Subscription>()

  /// initialze listener function for debouce
  const initialize = useCallback(() => {
    listener.current = new Observable<T>((subscriber) => {
      runner.current = subscriber
    })
      .pipe(debounceTime(options.delay))
      .subscribe({
        next: (value) => {
          callable(value)
        },
        complete: () => {
          initialize()
        }
      })
  }, [callable, delay])

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
