import { SetStateAction, useCallback, useRef, useState } from "react";
import { useUpdateEffect } from "./use-update-effect";

type Callback<S> = (state: S) => void;
type StateSetter<S> = (state: SetStateAction<S>, callback?: Callback<S>) => void;
type UsedUpdateState<S> = [S, StateSetter<S>];

/**
 * @description
 * in class component
 * use setState second parameter callback to get the latest state
 */
function useUpdateState<S = undefined>(): UsedUpdateState<S | undefined>;
function useUpdateState<S>(initialState: S): UsedUpdateState<S>;
function useUpdateState<S>(initialState?: S) {
  const [state, _setState] = useState(initialState);
  const callbackRef = useRef<Callback<S | undefined> | null>(null);

  const setState = useCallback<StateSetter<S | undefined>>((state, callback) => {
    _setState(state);
    callbackRef.current = callback ?? null;
  }, []);

  useUpdateEffect(() => {
    const _callback = callbackRef.current;
    if (!_callback) return;

    // execution & reset
    _callback(state);
    callbackRef.current = null;
  }, [state]);

  return [state, setState];
}

export { useUpdateState };
