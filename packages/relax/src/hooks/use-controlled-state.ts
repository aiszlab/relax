import { type Dispatch, type SetStateAction, useState } from "react";
import type { Partialable, RequiredIn, State } from "@aiszlab/relax/types";
import { isUndefined } from "../is/is-undefined";
import { isFunction } from "../is/is-function";
import { useEvent } from "./use-event";
import { flushSync } from "react-dom";

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

  // 变更状态函数
  // 变更内容为函数，且需要触发`onChange`，那么本次状态更新必为同步
  // 其余继续保持批处理逻辑
  const setState = useEvent<typeof _setState>((action) => {
    if (isFunction(action)) {
      if (onChange) {
        flushSync(() => {
          _setState(action);
        });

        onChange(_state);
        return;
      }

      _setState(action);
      return;
    }

    _setState(action);
    onChange?.(action);
  });

  // use controlled
  const state = isUndefined(controlledState) ? _state : controlledState;

  return [state, setState];
}

export { useControlledState };
