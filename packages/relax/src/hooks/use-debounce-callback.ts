import { useEffect, useMemo, useRef } from "react";
import { debounce, type Debounced, type Debouncer } from "../utils/debounce";
import { useEvent } from "./use-event";
import { isFunction } from "../is/is-function";
import { useDefault } from "../hooks/use-default";
import type { AnyFunction } from "@aiszlab/relax/types";

const useDebouncer = <T extends AnyFunction, R>(
  debouncer: T | Debouncer<T, R>,
): Debouncer<T, R> => {
  const _debouncer = useMemo(() => {
    return isFunction(debouncer) ? { callback: debouncer, pipe: null } : debouncer;
  }, [debouncer]);

  const callback = useEvent((piped: R) => {
    if (_debouncer.pipe) {
      return _debouncer.callback(piped);
    }
    return _debouncer.callback(...(piped as Parameters<T>)) as ReturnType<T>;
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
function useDebounceCallback<T extends AnyFunction>(callback: T, wait?: number): Debounced<T>;
function useDebounceCallback<T extends AnyFunction, R = unknown>(
  debouncer: Debouncer<T, R>,
  wait?: number,
): Debounced<T>;
function useDebounceCallback<T extends AnyFunction, R>(
  debouncer: T | Debouncer<T, R>,
  wait: number = 1000,
) {
  const { callback, pipe } = useDebouncer(debouncer);

  const _debounced = useMemo(() => {
    return debounce<T, R>(
      {
        callback,
        pipe,
      },
      wait,
    );
  }, [wait]);

  useEffect(() => {
    // dispose
    return () => {
      _debounced.abort();
    };
  }, [_debounced]);

  return _debounced;
}

export { useDebounceCallback };
