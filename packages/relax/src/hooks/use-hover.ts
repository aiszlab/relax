import { type PointerEventHandler } from "react";
import { useBoolean } from "../hooks/use-boolean";
import { chain } from "../utils/chain";
import type { Last } from "@aiszlab/relax/types";
import { useEvent } from "./use-event";
import { useDefault } from "./use-default";

type UsingHover<T> = {
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

export const useHover = <T extends Element = Element>({
  onEnter,
  onLeave,
}: UsingHover<T> = {}): UsedHover<T> => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false);

  const onPointerEnter = useEvent<Last<UsedHover<T>>["onPointerEnter"]>((event) => {
    chain(onEnter, turnOn)(event);
  });

  const onPointerLeave = useEvent<Last<UsedHover<T>>["onPointerLeave"]>((event) => {
    chain(onLeave, turnOff)(event);
  });

  const hoverProps = useDefault<Last<UsedHover<T>>>(() => ({
    onPointerEnter,
    onPointerLeave,
  }));

  return [isHovered, hoverProps];
};
