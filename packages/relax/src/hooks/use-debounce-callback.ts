import { useEffect, useMemo, useRef } from "react";
import { debounce, type Debounced, type Debouncer } from "../utils/debounce";
import { type Callable, useEvent } from "./use-event";
import { isFunction } from "../is/is-function";
import { useDefault } from "../hooks/use-default";

const useDebouncer = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  debouncer: T | Debouncer<T, R>,
): Debouncer<T, R> => {
  const _debouncer = useMemo(() => {
    return isFunction(debouncer) ? { callback: debouncer, pipe: null } : debouncer;
  }, [debouncer]);

  const callback = useEvent((piped: R) => {
    if (_debouncer.pipe) {
      return _debouncer.callback(piped);
    }
    return _debouncer.callback(...piped);
  });

  const pipe = useEvent((...args: Parameters<T>) => {
    if (!_debouncer.pipe) return args as unknown as R;
    return _debouncer.pipe(...args);
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
 * debounce callback
 *
 * @param callback
 * @param wait number
 * @description
 * The delay time (in milliseconds) until the debounce function is called.
 * default 1000
 *
 * @example
 * 1000
 */
export const useDebounceCallback = <T extends Callable, R extends Array<unknown> = Parameters<T>>(
  debouncer: T | Debouncer<T, R>,
  wait: number = 1000,
) => {
  const debounced = useRef<Debounced<T> | null>(null);
  const { callback, pipe } = useDebouncer(debouncer);

  useEffect(() => {
    const _debounced = debounce<T, R>(
      {
        callback,
        pipe,
      },
      wait,
    );

    debounced.current = _debounced;

    // dispose
    return () => {
      _debounced.abort();
      debounced.current = null;
    };
  }, [wait]);

  return useDefault<Debounced<T>>(() => ({
    next: (...args: Parameters<T>) => debounced.current?.next(...args),
    flush: () => debounced.current?.flush(),
    abort: () => debounced.current?.abort(),
  }));
};
