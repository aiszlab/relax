import { RefObject, useRef, useState } from "react";
import { useMounted } from "./use-mounted";
import { Nullable } from "../types";
import { useEvent } from "./use-event";

type UsedElementSize<T extends HTMLElement> = [
  RefObject<T | null>,
  { width: number; height: number },
];

/**
 * @description
 * listen parent size change
 * provider with\height to child
 */
export const useElementSize = <T extends HTMLElement = HTMLDivElement>(): UsedElementSize<T> => {
  const elementRef = useRef<T>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const _animation = useRef(0);

  const resize = useEvent(({ width, height }: { width: number; height: number }) => {
    setWidth(width);
    setHeight(height);
  });

  useMounted(() => {
    let resizer: Nullable<ResizeObserver> = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry?.contentRect ?? {};
        _animation.current = window.requestAnimationFrame(() => {
          resize({ width, height });
        });
      });
    });

    if (elementRef.current) {
      resizer.observe(elementRef.current);
    }

    return () => {
      cancelAnimationFrame(_animation.current);
      resizer?.disconnect();
      resizer = null;
    };
  });

  return [elementRef, { width, height }];
};
