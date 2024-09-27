import { useEffect, type MutableRefObject } from "react";
import { useEvent } from "./use-event";
import { toArray } from "../utils/to-array";
import { contains, type Containable } from "../dom";
import type { Nullable, Arrayable } from "@aiszlab/relax/types";

/**
 * @description
 * click away
 */
export const useClickAway = (
  onClickAway: (event: MouseEvent) => void,
  target: Arrayable<MutableRefObject<Nullable<Containable>> | false>,
) => {
  const clickAway = useEvent((event: MouseEvent) => {
    const targets = toArray(target);
    const isContained = targets.some(
      (_target) => _target && contains(_target.current, event.target as Nullable<Node>),
    );
    if (isContained) return;

    onClickAway(event);
  });

  useEffect(() => {
    document.addEventListener("click", clickAway);

    return () => {
      document.removeEventListener("click", clickAway);
    };
  }, []);
};
