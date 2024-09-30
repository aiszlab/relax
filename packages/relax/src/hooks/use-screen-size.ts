import { useState } from "react";
import { isDomUsable } from "../is/is-dom-usable";
import { useDebounceCallback } from "./use-debounce-callback";
import { useMounted } from "./use-mounted";

/**
 * @description
 * Use the current screen size.
 */
export const useScreenSize = () => {
  const [size, setSize] = useState<{
    width: number;
    height: number;
  }>(() => {
    if (!isDomUsable())
      return {
        width: 0,
        height: 0,
      };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  const { next: resize, abort } = useDebounceCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 300);

  useMounted(() => {
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      abort();
    };
  });

  return size;
};
