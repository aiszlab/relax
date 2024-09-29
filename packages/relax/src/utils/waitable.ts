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

interface PropsWithoutPipe<T extends Array<unknown> = Array<unknown>> {
  callback: (...args: T) => unknown;
  pipe: undefined;
  timer: MonoTypeOperatorFunction<T>;
}

interface PropsWithPipe<T extends Array<unknown> = Array<unknown>, R = unknown> {
  callback: (value: R) => unknown;
  pipe: (...args: T) => R | Promise<R>;
  timer: MonoTypeOperatorFunction<T>;
}

type Props<T extends Array<unknown> = Array<unknown>, R = unknown> =
  | PropsWithoutPipe<T>
  | PropsWithPipe<T, R>;

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

  constructor(props: Props<T, R>) {
    this.#cook$ = null;
    this.#waiter$ = null;
    this.#timer = props.timer;
    this.#pipe = props.pipe;
    this.#callback = props.callback;

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
          // @ts-ignore
          this.#callback(...args);
        } else {
          // @ts-ignore
          this.#callback(args);
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
