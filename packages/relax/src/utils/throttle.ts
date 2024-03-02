import { Observable, throttleTime } from 'rxjs'
import type { Arguments, First } from '../types'
import { type Debounced, Trigger } from './debounce'

export type Throttled<T> = Debounced<T>

export const throttle = <T extends Function>(callback: T, wait: number): Throttled<T> => {
  const trigger = new Trigger<First<Arguments<T>>>()

  const listened = new Observable((subscriber) => {
    trigger.use = subscriber
  })
    .pipe(throttleTime(wait))
    .subscribe((value) => {
      callback(value)
    })

  return {
    next: ((value: First<Arguments<T>>) => trigger.next(value)) as unknown as T,
    complete: () => trigger.complete(),
    cancel: () => {
      listened.unsubscribe()
      trigger.error()
    }
  }
}
