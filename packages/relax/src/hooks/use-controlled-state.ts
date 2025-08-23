import { type Dispatch, type SetStateAction, useState } from "react";
import type { Partialable, RequiredIn, State } from "@aiszlab/relax/types";
import { isUndefined } from "../is/is-undefined";
import { useUpdateEffect } from "./use-update-effect";
import { isFunction } from "../is/is-function";

type UsingControlledState<S> = {
  /**
   * @description
   * default value
   */
  defaultState?: State<S>;
};

type UsedControlledState<T> = [T, Dispatch<SetStateAction<T>>];

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
function useControlledState<T>(): UsedControlledState<Partialable<T>>;
function useControlledState<T>(controlledState: T): UsedControlledState<T>;
function useControlledState<T>(
  controlledState: T,
  usingControlledState: UsingControlledState<undefined>,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState: Partialable<T>,
  usingControlledState: RequiredIn<UsingControlledState<T>, "defaultState">,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState: T,
  usingControlledState: UsingControlledState<T>,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState?: T,
  { defaultState }: UsingControlledState<T> = {},
) {
  // initialize state
  const [_state, _setState] = useState(() => {
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

  return [state, _setState];
}

export { useControlledState };
