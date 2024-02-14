import { useCallback, useEffect, useRef } from 'react'
import { Observable, Subscriber, Subscription, throttleTime } from 'rxjs'
import { useEvent } from '../hooks/use-event'

interface Options {
  /**
   * @description
   * The delay time (in milliseconds) until the throttle function is called.
   * default 1000
   *
   * @example
   * 2000
   */
  readonly duration: number
}

type Callable<T, R> = ReturnType<typeof useEvent<[T], R>>

/**
 * @author murukal
 *
 * @description
 * throttle callback
 */
export const useThrottleCallback = <T, R>(_callable: Callable<T, R>, options?: Options) => {
  const trigger = useRef<Subscriber<T> | null>(null)
  const listener = useRef<Subscription | null>(null)
  const duration = options?.duration ?? 1000
  const callable = useEvent(_callable)

  const listen = useCallback(() => {
    const listened = new Observable<T>((subscriber) => {
      trigger.current = subscriber
    })
      .pipe(throttleTime(duration))
      .subscribe({
        next: callable,
        complete: listen
      })

    listener.current = listened
    return listened
  }, [duration])

  useEffect(() => {
    const listened = listen()

    // dispose
    return () => {
      listened.unsubscribe()
      listener.current = null
      trigger.current = null
    }
  }, [listen])

  const next = useEvent((value: T) => {
    trigger.current?.next(value)
  })

  const complete = useEvent(() => {
    trigger.current?.complete()
  })

  const cancel = useEvent(() => {
    listener.current?.unsubscribe()
  })

  return {
    next,
    complete,
    cancel
  }
}
