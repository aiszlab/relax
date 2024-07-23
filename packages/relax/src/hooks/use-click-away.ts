import { useEffect, type MutableRefObject } from "react";
import { useEvent } from "./use-event";
import { contains } from "../dom";
import { toArray } from "../utils/to-array";
import type { Arrayable } from "../types/arrayable";

/**
 * @description
 * click away
 */
export const useClickAway = (
  onClickAway: (event: MouseEvent) => void,
  target: Arrayable<MutableRefObject<HTMLElement | null>>,
) => {
  const clickAway = useEvent((event: MouseEvent) => {
    const targets = toArray(target);
    const isContained = targets.some((_target) => contains(_target.current, event.target as Node));
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
