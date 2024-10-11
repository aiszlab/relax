import { debounceTime } from "rxjs";
import { isFunction } from "../is/is-function";
import { Waitable, type Waiting } from "./waitable";
import type { AnyFunction } from "@aiszlab/relax/types";

export interface Debounced<T extends AnyFunction> {
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

export type Debouncer<T extends AnyFunction, R> = {
  callback: (args: R) => ReturnType<T>;
  pipe: (...args: Parameters<T>) => R | Promise<R>;
};

export const debounce = <T extends AnyFunction, R>(
  debouncer: Debouncer<T, R> | T,
  wait: number,
): Debounced<T> => {
  const _isFunction = isFunction(debouncer);
  const callback = _isFunction ? debouncer : debouncer.callback;

  const waiter = new Waitable<Parameters<T>, R>({
    callback,
    pipe: _isFunction ? void 0 : debouncer.pipe,
    timer: debounceTime(wait),
  } as Waiting<Parameters<T>, R>);

  return {
    next: (...args: Parameters<T>) => waiter.next(...args),
    flush: () => waiter.flush(),
    abort: () => waiter.abort(),
  };
};
