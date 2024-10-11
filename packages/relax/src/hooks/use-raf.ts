import { useRef } from "react";
import { useEvent } from "./use-event";
import type { AnyFunction } from "@aiszlab/relax/types";

type UsingRaf = [
  callback: AnyFunction,

  {
    /**
     * @description
     * run callback immediately
     * if `timely` is true, run callback immediately
     * otherwise, wait for next frame
     */
    timely?: boolean;
  }?,
];

type UsedRaf = () => void;

type UseRaf = (...args: UsingRaf) => UsedRaf;

/**
 * @description
 * raf
 */
export const useRaf: UseRaf = (_callback, { timely } = {}) => {
  const callback = useEvent(_callback);
  const timed = useRef<number | null>(null);
  const isTimed = useRef(false);

  return () => {
    if (isTimed.current) return;
    isTimed.current = true;

    timely && callback();

    timed.current = requestAnimationFrame(() => {
      isTimed.current = false;
      !timely && callback();
    });
  };
};
