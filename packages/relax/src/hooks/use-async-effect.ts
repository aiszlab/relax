import { useEffect } from "react";

export const useAsyncEffect = (effect: () => Promise<void>, deps?: unknown[]) => {
  useEffect(() => {
    effect();
  }, deps);
};
