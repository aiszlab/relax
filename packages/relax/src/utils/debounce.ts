import { debounceTime } from "rxjs";
import { isFunction } from "../is/is-function";
import { type Callable } from "../hooks/use-event";
import { Waitable } from "./waitable";

export interface Debounced<T extends Callable> {
  /**
   * @description
   * value trigger
   */
  next: (...args: Parameters<T>) => void;

  /**
   * @description
   * complete current debounce/throttle function
   */
  flush: () => void;

  /**
   * @description
   * ignore any value after call cancel
   */
  abort: () => void;
}

export type Debouncer<T extends Callable, R extends Array<unknown> = Parameters<T>> = {
  callback: (...args: R) => ReturnType<T>;
  pipe: (...args: Parameters<T>) => R | Promise<R>;
};

export const debounce = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  debouncer: Debouncer<T, R> | T,
  wait: number,
): Debounced<T> => {
  const isCallable = isFunction(debouncer);
  const callback = isCallable ? debouncer : debouncer.callback;
  const pipe = isCallable ? (...args: Parameters<T>) => args as unknown as R : debouncer.pipe;

  const waiter = new Waitable({
    callback,
    pipe,
    timer: debounceTime(wait),
  });

  return {
    next: (...args: Parameters<T>) => waiter.next(...args),
    flush: () => waiter.flush(),
    abort: () => waiter.abort(),
  };
};
