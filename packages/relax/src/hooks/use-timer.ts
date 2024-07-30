import { useCallback, useRef } from "react";
import { useUnmount } from "./use-unmount";

/**
 * @description
 * use timer
 */
export const useTimer = () => {
  const timed = useRef<number | undefined>(void 0);

  const clear = useCallback(() => {
    clearTimeout(timed.current);
    timed.current = void 0;
  }, []);

  const timeout = useCallback((handler: VoidFunction, duration: number = 0) => {
    clear();

    if (duration <= 0) {
      handler();
      return;
    }

    timed.current = setTimeout(() => {
      handler();
    }, duration);
  }, []);

  useUnmount(clear);

  return { timeout, clear };
};
