import { useEffect, useRef } from 'react'
import { Observable, delay, type Subscription, type Subscriber } from 'rxjs'
import { useEvent } from './use-event'

/**
 * @author murukal
 *
 * @description
 * timeout effect
 */
export const useTimeout = (handler: Function, wait: number) => {
  const timer = useRef<Subscription | null>(null)
  const trigger = useRef<Subscriber<void> | null>(null)

  // when user what to flush timeout handler
  // if trigger already registed, just complete trigger
  // not registed, call `handler` manaully
  const flush = useEvent(() => {
    if (trigger.current) {
      trigger.current.complete()
      timer.current?.unsubscribe()
    } else {
      handler()
    }

    trigger.current = null
    timer.current = null
  })

  // cancel
  const cancel = useEvent(() => {
    trigger.current?.error()
    timer.current?.unsubscribe()
    trigger.current = null
    timer.current = null
  })

  useEffect(() => {
    // if 0, always mean not need to set timeout
    if (wait <= 0) {
      return
    }

    const _timer = new Observable<void>((_trigger) => {
      trigger.current = _trigger
      _trigger.next()
    })
      .pipe(delay(wait))
      .subscribe(() => {
        handler()
      })
    timer.current = _timer

    // unmount callback
    return cancel
  }, [wait])

  return {
    flush,
    cancel
  }
}
