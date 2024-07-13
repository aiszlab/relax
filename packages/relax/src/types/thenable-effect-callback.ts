import type { EffectCallback } from "react";

/**
 * @description
 * thenable effect callback
 */
export type ThenableEffectCallback = () => ReturnType<EffectCallback> | PromiseLike<ReturnType<EffectCallback>>;
