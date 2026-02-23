import { type Dispatch, type SetStateAction, useState } from "react";
import type { Partialable, RequiredIn, State } from "@aiszlab/relax/types";
import { isUndefined } from "../is/is-undefined";
import { isFunction } from "../is/is-function";
import { useUpdateEffect } from "./use-update-effect";
import { useEvent } from "./use-event";

type UsingControlledState<S> = {
  /**
   * @description
   * default value
   */
  defaultState?: State<S>;

  /**
   * 状态发生改变后触发的回调事件
   * @default undefined
   */
  onChange?: (state: Partialable<S>) => void;
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
  controlledState: Partialable<T>,
  usingControlledState: RequiredIn<UsingControlledState<T>, "defaultState">,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState: T,
  usingControlledState: UsingControlledState<T>,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState: T,
  usingControlledState: UsingControlledState<T>,
): UsedControlledState<T>;
function useControlledState<T>(
  controlledState?: T,
  { defaultState, onChange }: UsingControlledState<T> = {},
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

  // use controlled
  const state = isUndefined(controlledState) ? _state : controlledState;

  // 复写状态更新
  const setState = useEvent<typeof _setState>((_newValue) => {
    const _newState = isFunction(_newValue) ? _newValue(state) : _newValue;

    _setState(_newState);
    onChange?.(_newState);
  });

  return [state, setState];
}

export { useControlledState };
