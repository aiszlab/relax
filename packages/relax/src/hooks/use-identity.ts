import { useCallback, useId, useRef } from "react";

type UsedIdentity = [string, () => string];

/**
 * @description
 * extends from react `useId`
 */
export const useIdentity = (signal = ""): UsedIdentity => {
  const id = useId();
  const count = useRef(0);

  const unique = useCallback(() => {
    if (!signal) {
      return `${id}${count.current++}`;
    }
    return `${id}${signal}:${count.current++}`;
  }, []);

  return [id, unique];
};
