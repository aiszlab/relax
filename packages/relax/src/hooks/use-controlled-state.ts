import { type Dispatch, type SetStateAction, useState } from "react";
import type { State } from "../types";
import { isUndefined } from "../is/is-undefined";
import { useUpdateEffect } from "./use-update-effect";
import { isFunction } from "../is/is-function";

type UseControlledStateBy<R> = {
  /**
   * @description
   * default value
   */
  defaultState?: State<R>;
};

type UsedControlledState<T> = [T, Dispatch<SetStateAction<T>>];

type Requirable<T, P> = T extends undefined ? (P extends undefined ? T : Exclude<T, undefined>) : T;

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
export const useControlledState = <T, P extends T = T>(
  controlledState: T,
  { defaultState }: UseControlledStateBy<P> = {},
) => {
  // initialize state
  const [_state, _setState] = useState<T>(() => {
    // default use controlled state
    if (!isUndefined(controlledState)) {
      return controlledState;
    }

    // not controlled use default state
    if (isFunction(defaultState)) {
      return defaultState();
    }
    return defaultState ?? controlledState;
  });

  // sync value back to `undefined` when it from control to un-control
  useUpdateEffect(() => {
    if (!isUndefined(controlledState)) {
      return;
    }

    _setState(defaultState ?? controlledState);
  }, [controlledState]);

  // use controlled
  const state = isUndefined(controlledState) ? _state : controlledState;

  return [state, _setState] as UsedControlledState<Requirable<T, P>>;
};
