import { Observable, debounceTime, type Subscriber, Subscription, concatMap, from, map } from 'rxjs'
import { isFunction } from '..'
import { Nullable } from '../types'

export type Callable = (...args: any) => any

export interface Debounced<T extends Callable> {
  /**
   * @description
   * value trigger
   */
  next: (...args: Parameters<T>) => void

  /**
   * @description
   * complete current debounce function
   */
  flush: () => void

  /**
   * @description
   * ignore any value after call cancel
   */
  abort: () => void
}

export type Debouncer<T extends Callable, P extends Nullable<(...args: Parameters<T>) => R> = null, R = unknown> = {
  callback: (...args: P extends Callable ? R[] : Parameters<T>) => ReturnType<T>
  pipeable: P
}

export class Trigger<T extends Callable, P extends Nullable<(...args: Parameters<T>) => R> = null, R = unknown> {
  #subscriber: Nullable<Subscriber<Parameters<T>>>
  #subscription: Nullable<Subscription>

  #callback: Nullable<Debouncer<T, P, R>['callback']>
  #pipeable: Nullable<Debouncer<T, P, R>['pipeable']>
  #wait: number

  constructor(debouncer: Debouncer<T, P, R>, wait: number) {
    this.#subscriber = null
    this.#subscription = null
    this.#callback = debouncer.callback
    this.#pipeable = debouncer.pipeable
    this.#wait = wait
  }

  /**
   * @description
   * 创建监听器
   */
  use() {
    this.#subscription = new Observable<Parameters<T>>((subscriber) => {
      this.#subscriber = subscriber
    })
      .pipe(
        debounceTime(this.#wait),
        map((args) => (this.#pipeable ? ([this.#pipeable(...args)] satisfies [R]) : args))
      )
      .subscribe((args) => {
        // @ts-ignore
        this.#callback?.(...args)
      })

    return this
  }

  /**
   * @description
   * flush
   * complete all debounced handlers
   * in relax, we will create a new observable for next debounce handler
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
   * in relax, we will create a new observable for next debounce handler
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

export const debounce = <T extends (...args: any) => any>(debouncer: Debouncer<T> | T, wait: number): Debounced<T> => {
  const _isFunction = isFunction(debouncer)
  const trigger = new Trigger<T>(
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
