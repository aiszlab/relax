import type { State, StateGetter } from "../types";

/**
 * @description
 * is state getter
 */
export const isStateGetter = <T>(state: State<T>): state is StateGetter<T> => {
  return typeof state === "function";
};
