import { useRef } from "react";
import { useEvent } from "./use-event";
import type { AnyFunction } from "@aiszlab/relax/types";
import { useUnmount } from "./use-unmount";

type UsingRaf = {
  /**
   * @description
   * run callback immediately
   * if `timely` is true, run callback immediately
   * otherwise, wait for next frame
   */
  timely?: boolean;
};

/**
 * @description
 * raf
 */
export const useRaf = <T extends AnyFunction<any[], void>>(
  _callback: T,
  { timely }: UsingRaf = {},
): T => {
  const timed = useRef<number | null>(null);

  useUnmount(() => {
    if (!timed.current) return;
    cancelAnimationFrame(timed.current);
  });

  const callback = useEvent((...args) => {
    if (timed.current) return;

    if (timely) {
      _callback(...args);
      return;
    }

    timed.current = requestAnimationFrame(() => {
      timed.current = null;
      _callback(...args);
    });
  });

  return callback as T;
};
