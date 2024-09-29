import { useRef, useCallback, useEffect } from "react";

export type Callable = (...args: any) => any;

export const useEvent = <T extends Callable | Function>(callback: T): T => {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  });

  // @ts-ignore
  return useCallback((...args: Parameters<T>) => ref.current(...args), []);
};
