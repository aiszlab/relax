import { type Key, useCallback, useRef } from "react";
import { type Orientation, scrollTo as _scrollTo } from "../dom/scroll-to";

interface UseScrollableProps {
  orientation?: Orientation;
}

/**
 * @description
 * scrollable hook
 */
export const useScrollable = <P extends HTMLElement, C extends HTMLElement>({
  orientation = "vertical",
}: UseScrollableProps = {}) => {
  const targetRef = useRef<P>(null);
  const triggerRefs = useRef<Map<Key, C | null>>(new Map());

  const scrollTo = useCallback(
    (to: number, duration = 0) => {
      const target = targetRef.current;
      if (!target) return;

      // use animated scroll
      _scrollTo(target, to, {
        duration,
        orientation,
      });
    },
    [orientation],
  );

  const to = useCallback(
    (key: Key) => {
      const trigger = triggerRefs.current.get(key);
      if (!trigger) return 0;
      // different orientation, use different property
      return orientation === "vertical" ? trigger.offsetTop : trigger.offsetLeft;
    },
    [orientation],
  );

  // set trigger
  const setTrigger = useCallback((key: Key, trigger: C) => {
    triggerRefs.current.set(key, trigger);
  }, []);

  return {
    targetRef,
    triggerRefs,
    scrollTo,
    to,
    setTrigger,
  };
};
