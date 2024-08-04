import { type Dispatch, type SetStateAction, useState } from "react";
import type { State, RequiredTo } from "../types";
import { isStateGetter } from "../is/is-state-getter";
import { isUndefined } from "../is/is-undefined";
import { useUpdateEffect } from "./use-update-effect";

type UseControlledStateBy<T> = {
  /**
   * @description
   * default value
   */
  defaultState?: State<T>;
};

type UsedControlledState<T, R> = R extends undefined
  ? [T, Dispatch<SetStateAction<T>>]
  : [RequiredTo<T>, Dispatch<SetStateAction<RequiredTo<T>>>];

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
export const useControlledState = <T, R extends T>(
  controlledState: T,
  { defaultState }: UseControlledStateBy<R> = {},
): UsedControlledState<T, R> => {
  /// initialize state
  const [_state, _setState] = useState<T>(() => {
    // default use controlled state
    if (!isUndefined(controlledState)) {
      return controlledState;
    }

    // not controlled use default prop
    if (isUndefined(defaultState)) return controlledState;
    if (isStateGetter(defaultState)) return defaultState();
    return defaultState;
  });

  /// sync value back to `undefined` when it from control to un-control
  useUpdateEffect(() => {
    if (!isUndefined(controlledState)) return;
    _setState(controlledState ?? defaultState!);
  }, [controlledState]);

  /// use controlled
  const state = !isUndefined(controlledState) ? controlledState : _state;

  // @ts-ignore
  return [state, _setState];
};
