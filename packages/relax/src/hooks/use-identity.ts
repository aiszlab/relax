import { useCallback, useId, useRef } from "react";

/**
 * @description
 * extends from react `useId`
 */
export const useIdentity = (signal = ""): [string, () => string] => {
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
