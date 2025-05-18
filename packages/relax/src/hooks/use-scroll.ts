import { useCallback } from "react";
import { isDomUsable } from "../is/is-dom-usable";
import type { AnyFunction } from "../types";
import { useEvent } from "./use-event";
import { useMounted } from "./use-mounted";

/**
 * `window` `scroll` event
 */
function useScroll(callback: AnyFunction<[Event]>) {
  const _callback = useEvent((event: Event) => {
    callback(event);
  });

  const clean = useCallback(() => {
    window.removeEventListener("scroll", _callback);
  }, [_callback]);

  useMounted(() => {
    if (!isDomUsable()) return;

    window.addEventListener("scroll", _callback);
    return clean;
  });

  return clean;
}

export { useScroll };
