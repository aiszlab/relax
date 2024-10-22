import { useSyncExternalStore } from "react";
import type { Nullable } from "../types";
import { chain } from "../utils/chain";
import { toFunction } from "../utils/to-function";

type SetState<T> = (state: T | ((previous: T) => T)) => void;
type Initializer<T> = (setState: SetState<T>) => T;

type UseStore<T> = {
  (): T;
  get state(): T;
};

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

const using = <T>(initializer: Initializer<T>): UseStore<T> => {
  const { subscribe, initialState, state } = initialize(initializer);

  // create like hooks
  const useStore = () => useSyncExternalStore(subscribe, state, initialState);

  Object.defineProperty(useStore, "state", {
    get() {
      return state();
    },
    set() {
      console.warn("`useStore`.`state` is readonly property!");
      return Reflect.get(useStore, "state");
    },
  });

  return useStore as UseStore<T>;
};

export { using };
