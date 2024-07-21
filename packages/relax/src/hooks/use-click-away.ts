import { useEffect, type MutableRefObject } from "react";
import { useEvent } from "./use-event";
import { contains } from "../dom";

/**
 * @description
 * click away
 */
export const useClickAway = (
  onClickAway: (event: MouseEvent) => void,
  target: MutableRefObject<HTMLElement | null>,
) => {
  const clickAway = useEvent((event: MouseEvent) => {
    if (contains(target.current, event.target as Node)) return;
    onClickAway(event);
  });

  useEffect(() => {
    document.addEventListener("click", clickAway);

    return () => {
      document.removeEventListener("click", clickAway);
    };
  }, []);
};
