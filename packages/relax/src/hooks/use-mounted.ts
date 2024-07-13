import { useEffect } from "react";
import { effect } from "../utils/effect";
import type { ThenableEffectCallback } from "../types";

/**
 * @author murukal
 *
 * @description
 * when components mounted
 */
export const useMounted = (callback: ThenableEffectCallback) => {
  useEffect(() => {
    return effect(callback);
  }, []);
};
