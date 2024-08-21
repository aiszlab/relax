import { type MouseEventHandler, type PointerEventHandler, useCallback } from "react";
import { useBoolean } from "../hooks/use-boolean";
import { chain } from "../utils/chain";
import type { Last } from "@aiszlab/relax/types";
import { useEvent } from "./use-event";

type UseHoverBy<T> = {
  onEnter?: PointerEventHandler<T>;
  onLeave?: PointerEventHandler<T>;
};

type UsedHover<T> = [
  boolean,
  {
    onPointerEnter: PointerEventHandler<T>;
    onPointerLeave: PointerEventHandler<T>;
    // onMouseEnter: MouseEventHandler<T>;
    // onMouseLeave: MouseEventHandler<T>;
  },
];

export const useHover = <T extends Element = Element>(props?: UseHoverBy<T>): UsedHover<T> => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false);

  const onPointerEnter = useEvent<Last<UsedHover<T>>["onPointerEnter"]>((event) => {
    chain(props?.onEnter, turnOn)(event);
  });

  const onPointerLeave = useEvent<Last<UsedHover<T>>["onPointerLeave"]>((event) => {
    chain(props?.onLeave, turnOff)(event);
  });

  return [isHovered, { onPointerEnter, onPointerLeave }];
};
