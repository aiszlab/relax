import {
  type PointerEventHandler,
  type MouseEventHandler,
  type MouseEvent,
  type RefObject,
  useCallback,
} from "react";
import { useBoolean } from "../hooks/use-boolean";
import { useEvent } from "./use-event";
import { contains } from "../dom";
import type { Nullable } from "../types";

type UsingHover<T> = {
  onEnter?: MouseEventHandler<T>;
  onLeave?: MouseEventHandler<T>;
  ref?: RefObject<Nullable<T>>;
};

type UsedHover<T> = [
  boolean,
  {
    onPointerEnter: PointerEventHandler<T>;
    onPointerLeave: PointerEventHandler<T>;
    onMouseEnter: MouseEventHandler<T>;
    onMouseLeave: MouseEventHandler<T>;
    onMouseOut?: MouseEventHandler<T>;
  },
];

export const useHover = <T extends Element = Element>({
  onEnter,
  onLeave,
  ref,
}: UsingHover<T> = {}): UsedHover<T> => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false);

  const enter = useEvent((event: MouseEvent<T>) => {
    onEnter?.(event);
    turnOn();
  });

  const leave = useEvent((event: MouseEvent<T>) => {
    onLeave?.(event);
    turnOff();
  });

  const moveOut = useCallback((event: MouseEvent<T>) => {
    if (!ref?.current) return;
    if (contains(ref?.current, event.relatedTarget)) return;

    leave(event);
  }, []);

  return [
    isHovered,
    {
      onMouseEnter: enter,
      onPointerEnter: enter,
      onMouseLeave: leave,
      onPointerLeave: leave,
      ...(!!ref && {
        onMouseOut: moveOut,
      }),
    },
  ];
};
