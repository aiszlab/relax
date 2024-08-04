import { type Dispatch, type SetStateAction, useState } from "react";
import type { State, RequiredTo } from "../types";
import { isStateGetter } from "../is/is-state-getter";
import { isUndefined } from "../is/is-undefined";
import { useUpdateEffect } from "./use-update-effect";

type UseControlledStateBy<R> = {
  /**
   * @description
   * default value
   */
  defaultState?: State<R>;
};

type UsedControlledState<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
export const useControlledState = <T, R extends T = T, P extends T | undefined = undefined>(
  controlledState: P,
  useBy: T extends undefined | unknown
    ? UseControlledStateBy<R>
    : P extends undefined
    ? Required<UseControlledStateBy<R>>
    : UseControlledStateBy<R>,
): UsedControlledState<R extends undefined ? P : R> => {
  // initialize state
  // @ts-ignore
  const [_state, _setState] = useState<T>(() => {
    // default use controlled state
    if (!isUndefined(controlledState)) {
      return controlledState;
    }

    // not controlled use default prop
    if (isUndefined(useBy.defaultState)) return controlledState;
    if (isStateGetter(useBy.defaultState)) return useBy.defaultState();
    return useBy.defaultState;
  });

  /// sync value back to `undefined` when it from control to un-control
  useUpdateEffect(() => {
    if (!isUndefined(controlledState)) return;
    _setState(controlledState ?? useBy.defaultState!);
  }, [controlledState]);

  /// use controlled
  const state = !isUndefined(controlledState) ? controlledState : _state;

  // @ts-ignore
  return [state, _setState];
};
