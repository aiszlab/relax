import { useEffect, useMemo, useRef } from "react";
import { throttle, type Throttler, type Throttled } from "../utils/throttle";
import { useEvent } from "./use-event";
import { isFunction } from "../is/is-function";
import { useDefault } from "../hooks/use-default";
import type { AnyFunction } from "@aiszlab/relax/types";

const useThrottler = <T extends AnyFunction, R>(
  throttler: T | Throttler<T, R>,
): Throttler<T, R> => {
  const _throttler = useMemo(() => {
    return isFunction(throttler) ? { callback: throttler, pipe: null } : throttler;
  }, [throttler]);

  const callback = useEvent((piped: R) => {
    if (_throttler.pipe) {
      return _throttler.callback(piped);
    }
    return _throttler.callback(...(piped as Parameters<T>)) as ReturnType<T>;
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
function useThrottleCallback<T extends AnyFunction>(callback: T, wait: number): Throttled<T>;
function useThrottleCallback<T extends AnyFunction, R>(
  throttler: Throttler<T, R>,
  wait: number,
): Throttled<T>;
function useThrottleCallback<T extends AnyFunction, R>(
  throttler: T | Throttler<T, R>,
  wait: number = 1000,
) {
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
    next: (...args) => throttled.current?.next(...args),
    flush: () => throttled.current?.flush(),
    abort: () => throttled.current?.abort(),
  }));
}

export { useThrottleCallback };
