import { useRef, useCallback, useEffect } from "react";
import type { AnyFunction } from "@aiszlab/relax/types";

export const useEvent = <T extends AnyFunction>(callback: T) => {
  const ref = useRef<T>(callback);

  useEffect(() => {
    ref.current = callback;
  });

  return useCallback(
    ((...args: Parameters<AnyFunction>) => ref.current(...args)) as unknown as T,
    [],
  );
};
