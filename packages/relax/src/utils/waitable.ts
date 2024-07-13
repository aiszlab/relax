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

interface Props<T extends Array<unknown> = Array<unknown>, R extends Array<unknown> = T> {
  callback: (...args: T) => unknown;
  pipe: (...args: R) => T | Promise<T>;
  timer: MonoTypeOperatorFunction<R>;
}

/**
 * @description
 * waitable instance
 * for debounce...
 */
export class Waitable<T extends Array<unknown>, R extends Array<unknown> = T> {
  #cook$: Subscription | null;
  #waiter$: Subscriber<R> | null;

  #timer: MonoTypeOperatorFunction<R>;
  #pipe: (...args: R) => T | Promise<T>;
  #callback: (...ars: T) => unknown;

  constructor(props: Props<T, R>) {
    this.#cook$ = null;
    this.#waiter$ = null;
    this.#pipe = props.pipe;
    this.#timer = props.timer;
    this.#callback = props.callback;

    this.#use();
  }

  #use() {
    this.#cook$ = new Observable<R>((subscriber) => {
      this.#waiter$ = subscriber;
    })
      .pipe(
        this.#timer,
        switchMap((args) => {
          const piped = this.#pipe(...args);
          return isThenable(piped) ? from(piped) : of(piped);
        }),
      )
      .subscribe((args) => {
        this.#callback?.(...args);
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
  next(...args: R) {
    this.#waiter$?.next(args);
  }
}
