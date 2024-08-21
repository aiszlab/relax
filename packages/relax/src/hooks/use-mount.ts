import { useLayoutEffect } from "react";
import { effect } from "../utils/effect";
import type { ThenableEffectCallback } from "@aiszlab/relax/types";

/**
 * @author murukal
 *
 * @description
 * when components will mount
 */
export const useMount = (callback: ThenableEffectCallback) => {
  useLayoutEffect(() => {
    return effect(callback);
  }, []);
};
