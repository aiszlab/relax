import { useCallback, type DOMAttributes } from "react";
import { useBoolean } from "./use-boolean";
import { chain } from "../utils/chain";
import type { Last } from "@aiszlab/relax/types";

/**
 * @description
 * hooks for focus
 */
type Props<T> = Pick<DOMAttributes<T>, "onFocus" | "onBlur"> & {
  onFocusChange?: (isFocused: boolean) => void;
};

/**
 * @description
 * dom attributes
 */
type UsedFocus<T> = [boolean, Required<Pick<DOMAttributes<T>, "onFocus" | "onBlur">>];

export const useFocus = <T extends Element = Element>(props?: Props<T>): UsedFocus<T> => {
  const [isFocused, { turnOn, turnOff }] = useBoolean(false);

  const onFocus = useCallback<Last<UsedFocus<T>>["onFocus"]>(
    (e) => {
      chain(props?.onFocus, turnOn, () => props?.onFocusChange?.(true))(e);
    },
    [props?.onFocus, props?.onFocusChange],
  );

  const onBlur = useCallback<Last<UsedFocus<T>>["onBlur"]>(
    (e) => {
      chain(props?.onBlur, turnOff, () => props?.onFocusChange?.(false))(e);
    },
    [props?.onBlur, props?.onFocusChange],
  );

  return [isFocused, { onFocus, onBlur }];
};
