import { useRef, useState } from "react";
import { useDebounceCallback } from "./use-debounce-callback";
import { useMounted } from "./use-mounted";

/**
 * @description
 * listen parent size change
 * provider with\height to child
 */
export const useParentSize = <T extends HTMLElement = HTMLDivElement>() => {
  const parentRef = useRef<T>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const _animation = useRef(0);

  const { next: resize, abort } = useDebounceCallback(
    ({ width, height }: { width: number; height: number }) => {
      setWidth(width);
      setHeight(height);
    },
    300,
  );

  useMounted(() => {
    const resizer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const { width, height } = entry?.contentRect ?? {};
        _animation.current = window.requestAnimationFrame(() => {
          resize({ width, height });
        });
      });
    });

    if (parentRef.current) {
      resizer.observe(parentRef.current);
    }

    return () => {
      cancelAnimationFrame(_animation.current);
      resizer.disconnect();
      abort();
    };
  });

  return {
    parentRef,
    width,
    height,
  };
};
