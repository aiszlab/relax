import { isThenable } from "../is/is-thenable";
import type { EffectCallback } from "react";
import type { ThenableEffectCallback } from "../types";

/**
 * @description
 * call thenable effect
 */
export const effect = (callable: ThenableEffectCallback): ReturnType<EffectCallback> => {
  const called = callable();

  // if result is void
  if (!called) return void 0;

  // if result is promise like, return void
  if (isThenable(called)) return void 0;

  return called;
};
