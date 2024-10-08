import { useEffect, useMemo, useRef } from "react";
import { throttle, type Throttler, type Throttled } from "../utils/throttle";
import { type Callable, useEvent } from "./use-event";
import { isFunction } from "../is/is-function";
import { useDefault } from "../hooks/use-default";

const useThrottler = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  throttler: T | Throttler<T, R>,
): Throttler<T, R> => {
  const _throttler = useMemo(() => {
    return isFunction(throttler) ? { callback: throttler, pipe: null } : throttler;
  }, [throttler]);

  const callback = useEvent((piped: R) => {
    if (_throttler.pipe) {
      return _throttler.callback(piped);
    }
    return _throttler.callback(...piped);
  });

  const pipe = useEvent((...args: Parameters<T>) => {
    if (!_throttler.pipe) return args as unknown as R;
    return _throttler.pipe(...args);
  });

  return {
    callback,
    pipe,
  };
};

/**
 * @author murukal
 *
 * @description
 * throttle callback
 *
 * @param callback
 * @param wait number
 * @description
 * The wait time (in milliseconds) until the throttle function is called.
 * default 1000
 *
 * @example
 * 1000
 */
export const useThrottleCallback = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  throttler: T | Throttler<T, R>,
  wait: number = 1000,
) => {
  const throttled = useRef<Throttled<T> | null>(null);
  const { callback, pipe } = useThrottler(throttler);

  useEffect(() => {
    const _throttled = throttle<T, R>(
      {
        callback,
        pipe,
      },
      wait,
    );
    throttled.current = _throttled;

    // dispose
    return () => {
      _throttled.abort();
      throttled.current = null;
    };
  }, [wait]);

  return useDefault<Throttled<T>>(() => ({
    next: (...args: Parameters<T>) => throttled.current?.next(...args),
    flush: () => throttled.current?.flush(),
    abort: () => throttled.current?.abort(),
  }));
};
