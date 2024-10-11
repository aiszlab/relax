import {
  Observable,
  from,
  of,
  switchMap,
  type MonoTypeOperatorFunction,
  type Subscriber,
  type Subscription,
} from "rxjs";
import { isThenable } from "../is/is-thenable";

interface WaitingWithoutPipe<T extends Array<unknown> = Array<unknown>> {
  callback: (...args: T) => unknown;
  pipe: undefined;
  timer: MonoTypeOperatorFunction<T>;
}

interface WaitingWithPipe<T extends Array<unknown> = Array<unknown>, R = unknown> {
  callback: (value: R) => unknown;
  pipe: (...args: T) => R | Promise<R>;
  timer: MonoTypeOperatorFunction<T>;
}

export type Waiting<T extends Array<unknown> = Array<unknown>, R = unknown> =
  | WaitingWithoutPipe<T>
  | WaitingWithPipe<T, R>;

/**
 * @description
 * waitable instance
 * for debounce...
 */
export class Waitable<T extends Array<unknown>, R = unknown> {
  #cook$: Subscription | null;
  #waiter$: Subscriber<T> | null;

  #timer: MonoTypeOperatorFunction<T>;
  #pipe?: (...args: T) => R | Promise<R>;
  #callback: ((...args: T) => unknown) | ((...args: [R]) => unknown);

  constructor({ callback, pipe, timer }: Waiting<T, R>) {
    this.#cook$ = null;
    this.#waiter$ = null;
    this.#timer = timer;
    this.#pipe = pipe;
    this.#callback = callback;
    this.#use();
  }

  #use() {
    this.#cook$ = new Observable<T>((subscriber) => {
      this.#waiter$ = subscriber;
    })
      .pipe(
        this.#timer,
        switchMap((args) => {
          if (!this.#pipe) {
            return of(args);
          }

          const piped = this.#pipe(...args);
          return isThenable(piped) ? from(piped) : of(piped);
        }),
      )
      .subscribe((args) => {
        if (!this.#pipe) {
          this.#callback(...(args as R[]));
        } else {
          this.#callback(args as R);
        }
      });
  }

  /**
   * @description
   * flush
   * complete all handlers
   * in relax, we will create a new observable for next debounce/throttle handler
   * so it will make some async problems, pls attention
   */
  flush() {
    this.#waiter$?.complete();
    this.#use();
  }

  /**
   * @description
   * abort
   * cancel all handlers
   * in relax, we will create a new observable for next debounce/throttle handler
   */
  abort() {
    this.#cook$?.unsubscribe();
    this.#waiter$?.error();
    this.#use();
  }

  /**
   * @description
   * trigger value
   */
  next(...args: T) {
    this.#waiter$?.next(args);
  }
}
