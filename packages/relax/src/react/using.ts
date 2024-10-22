import { useSyncExternalStore } from "react";
import type { Nullable } from "../types";
import { chain } from "../utils/chain";
import { toFunction } from "../utils/to-function";

type SetState<T> = (state: T | ((previous: T) => T)) => void;
type Initializer<T> = (setState: SetState<T>) => T;

/**
 * @description
 * use closure make memoize
 */
const initialize = <T>(initializer: Initializer<T>) => {
  const listeners = new Set<VoidFunction>();

  // create a proxy object to store state
  // when update, call listeners
  const store = new Proxy<{ state: Nullable<T> }>(
    { state: null },
    {
      set: (target, key, value: T) => {
        Reflect.set(target, key, value);
        chain(...listeners)();
        return Reflect.get(target, key);
      },
    },
  );

  const subscribe = (listener: VoidFunction) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState: SetState<T> = (previous) => {
    store.state = toFunction(previous)(store.state ?? initialState);
  };

  // initialize state
  const initialState = (store.state = initializer(setState));

  return {
    subscribe,
    state: () => store.state ?? initialState,
    initialState: () => initialState,
  };
};

const using = <T>(initializer: Initializer<T>): (() => T) => {
  const { subscribe, initialState, state } = initialize(initializer);
  // return as hooks
  return () => useSyncExternalStore(subscribe, state, initialState);
};

export { using };
