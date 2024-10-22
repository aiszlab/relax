import { useSyncExternalStore } from "react";
import type { Nullable, State } from "../types";
import { chain } from "../utils/chain";
import { toFunction } from "../utils/to-function";

export type Initializer<T> = (setState: (_state: State<T>) => void) => T;

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
        chain(...listeners);
        return Reflect.get(target, key);
      },
    },
  );

  const subscribe = (listener: VoidFunction) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const setState = (_state: State<T>) => {
    store.state = toFunction(_state)();
  };

  // initialize state
  const initialState = (store.state = initializer(setState));

  return {
    subscribe,
    state: () => store.state ?? initialState,
    initialState: () => initialState,
  };
};

const using = <T>(initializer: Initializer<T>) => {
  const { subscribe, initialState, state } = initialize(initializer);
  return useSyncExternalStore(subscribe, state, initialState);
};

export { using };
