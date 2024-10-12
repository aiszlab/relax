import { type DOMAttributes } from "react";
import { useBoolean } from "./use-boolean";
import { chain } from "../utils/chain";
import type { Last } from "@aiszlab/relax/types";
import { useEvent } from "./use-event";
import { useDefault } from "./use-default";

/**
 * @description
 * hooks for focus
 */
type UsingFocus<T> = Pick<DOMAttributes<T>, "onFocus" | "onBlur"> & {
  onFocusChange?: (isFocused: boolean) => void;
};

/**
 * @description
 * dom attributes
 */
type UsedFocus<T> = [boolean, Required<Pick<DOMAttributes<T>, "onFocus" | "onBlur">>];

export const useFocus = <T extends Element = Element>({
  onBlur: _onBlur,
  onFocus: _onFocus,
  onFocusChange,
}: UsingFocus<T> = {}): UsedFocus<T> => {
  const [isFocused, { turnOn, turnOff }] = useBoolean(false);

  const onFocus = useEvent<Last<UsedFocus<T>>["onFocus"]>((event) => {
    chain(_onFocus, turnOn, () => onFocusChange?.(true))(event);
  });

  const onBlur = useEvent<Last<UsedFocus<T>>["onBlur"]>((event) => {
    chain(_onBlur, turnOff, () => onFocusChange?.(false))(event);
  });

  const focusProps = useDefault<Last<UsedFocus<T>>>(() => ({
    onBlur,
    onFocus,
  }));

  return [isFocused, focusProps];
};
