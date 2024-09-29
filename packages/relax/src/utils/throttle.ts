import { Waitable } from "./waitable";
import type { Debounced, Debouncer } from "./debounce";
import { isFunction } from "../is/is-function";
import { type Callable } from "../hooks/use-event";
import { throttleTime } from "rxjs";

export type Throttled<T extends Callable> = Debounced<T>;

export type Throttler<T extends Callable, R = unknown> = Debouncer<T, R>;

export const throttle = <T extends Callable, R = unknown>(
  throttler: Throttler<T, R> | T,
  wait: number,
): Throttled<T> => {
  const _isFunction = isFunction(throttler);
  const callback = _isFunction ? throttler : throttler.callback;

  // @ts-ignore
  const waiter = new Waitable<Parameters<T>, R>({
    callback,
    pipe: _isFunction ? void 0 : throttler.pipe,
    timer: throttleTime(wait),
  });

  return {
    next: (...args: Parameters<T>) => waiter.next(...args),
    flush: () => waiter.flush(),
    abort: () => waiter.abort(),
  };
};
