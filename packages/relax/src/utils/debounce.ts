import { Observable, debounceTime, type Subscriber, type Subscription, throttleTime, concatMap, from } from 'rxjs'
import { isFunction } from '../is/is-function'
import { type Nullable } from '../types'
import { type Callable } from '../hooks/use-event'

type Type = 'debounce' | 'throttle'

export interface Debounced<T extends Callable> {
  /**
   * @description
   * value trigger
   */
  next: (...args: Parameters<T>) => void

  /**
   * @description
   * complete current debounce/throttle function
   */
  flush: () => void

  /**
   * @description
   * ignore any value after call cancel
   */
  abort: () => void
}

export type Debouncer<T extends Callable, R extends Array<unknown> = Parameters<T>> = {
  callback: (...args: R) => ReturnType<T>
  pipeable: Nullable<(...args: Parameters<T>) => R | Promise<R>>
}

export class Trigger<T extends Callable, R extends Array<unknown> = Parameters<T>> {
  #subscriber: Nullable<Subscriber<Parameters<T>>>
  #subscription: Nullable<Subscription>

  #callback: Nullable<Debouncer<T, R>['callback']>
  #pipeable: Exclude<Debouncer<T, R>['pipeable'], null>
  #wait: number
  #type: Type

  constructor(debouncer: Debouncer<T, R>, wait: number, type: Type = 'debounce') {
    this.#subscriber = null
    this.#subscription = null
    this.#callback = debouncer.callback
    this.#pipeable = debouncer.pipeable ?? ((...args) => args)
    this.#wait = wait
    this.#type = type
  }

  /**
   * @description
   * create observable
   * used for debounce/throttle handler
   */
  use() {
    this.#subscription = new Observable<Parameters<T>>((subscriber) => {
      this.#subscriber = subscriber
    })
      .pipe(
        this.#type === 'debounce' ? debounceTime(this.#wait) : throttleTime(this.#wait),
        concatMap((args) => from(Promise.resolve(this.#pipeable(...args))))
      )
      .subscribe((args) => {
        this.#callback?.(...args)
      })

    return this
  }

  /**
   * @description
   * flush
   * complete all debounced handlers
   * in relax, we will create a new observable for next debounce/throttle handler
   * so it will make some async problems, pls attention
   */
  flush() {
    this.#subscriber?.complete()
    this.use()
  }

  /**
   * @description
   * abort
   * cancel all debounced handlers
   * in relax, we will create a new observable for next debounce/throttle handler
   */
  abort() {
    this.#subscription?.unsubscribe()
    this.#subscriber?.error()
    this.use()
  }

  /**
   * @description
   * trigger value
   */
  next(...args: Parameters<T>) {
    this.#subscriber?.next(args)
  }
}

export const debounce = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  debouncer: Debouncer<T, R> | T,
  wait: number
): Debounced<T> => {
  const _isFunction = isFunction(debouncer)
  const trigger = new Trigger<T, R>(
    {
      callback: _isFunction ? debouncer : debouncer.callback,
      pipeable: _isFunction ? null : debouncer.pipeable
    },
    wait
  ).use()

  return {
    next: (...args: Parameters<T>) => trigger.next(...args),
    flush: () => trigger.flush(),
    abort: () => trigger.abort()
  }
}
