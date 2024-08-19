import { type DependencyList, useEffect } from "react";
import { effect } from "../utils/effect";
import type { ThenableEffectCallback } from "../types";
import { useIsMounted } from "./use-is-mounted";

export const useUpdateEffect = (callback: ThenableEffectCallback, deps?: DependencyList) => {
  useEffect(() => {
    if (!isMounted()) return;
    return effect(callback);
  }, deps);

  const isMounted = useIsMounted();
};
