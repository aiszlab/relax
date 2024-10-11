import { type Waiting, Waitable } from "./waitable";
import type { Debounced, Debouncer } from "./debounce";
import { isFunction } from "../is/is-function";
import { throttleTime } from "rxjs";
import type { AnyFunction } from "@aiszlab/relax/types";

export type Throttled<T extends AnyFunction> = Debounced<T>;

export type Throttler<T extends AnyFunction, R = unknown> = Debouncer<T, R>;

export const throttle = <T extends AnyFunction, R = unknown>(
  throttler: Throttler<T, R> | T,
  wait: number,
): Throttled<T> => {
  const _isFunction = isFunction(throttler);
  const callback = _isFunction ? throttler : throttler.callback;

  const waiter = new Waitable<Parameters<T>, R>({
    callback,
    pipe: _isFunction ? void 0 : throttler.pipe,
    timer: throttleTime(wait),
  } as Waiting<Parameters<T>, R>);

  return {
    next: (...args: Parameters<T>) => waiter.next(...args),
    flush: () => waiter.flush(),
    abort: () => waiter.abort(),
  };
};
