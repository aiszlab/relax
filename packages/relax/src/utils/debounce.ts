import { Observable, debounceTime, type Subscriber } from 'rxjs'
import type { Arguments, First } from '../types'

export interface Debounced<T extends Function> {
  /**
   * @description
   * value trigger
   */
  next: (value: First<Arguments<T>>) => void

  /**
   * @description
   * complete current debounce function
   * this function will not be usable
   */
  complete: () => void

  /**
   * @description
   * ignore any value after call cancel
   * this function will not be usable
   */
  cancel: () => void
}

export class Trigger<T> {
  #next: ((value?: T) => void) | null
  #error: ((error?: unknown) => void) | null
  #complete: (() => void) | null

  constructor() {
    this.#next = null
    this.#error = null
    this.#complete = null
  }

  set use(subscriber: Subscriber<T>) {
    this.#next = (value) => subscriber.next(value)
    this.#error = (error) => subscriber.error(error)
    this.#complete = () => subscriber.complete()
  }

  next(value: T) {
    this.#next?.(value)
  }

  error(error?: unknown) {
    this.#error?.(error)
  }

  complete() {
    this.#complete?.()
  }
}

export const debounce = <T extends Function>(callback: T, wait: number): Debounced<T> => {
  const trigger = new Trigger<First<Arguments<T>>>()

  const listened = new Observable((subscriber) => {
    trigger.use = subscriber
  })
    .pipe(debounceTime(wait))
    .subscribe((value) => {
      callback(value)
    })

  return {
    next: (value: First<Arguments<T>>) => trigger.next(value),
    complete: () => trigger.complete(),
    cancel: () => {
      listened.unsubscribe()
      trigger.error()
    }
  }
}
