import type { EffectCallback } from 'react'
import { isThenable } from '../is/is-thenable'

/**
 * @description
 * thenable effect callback
 */
export type ThenableEffectCallback = () => ReturnType<EffectCallback> | PromiseLike<ReturnType<EffectCallback>>

/**
 * @description
 * call thenable effect callback
 */
export const callAsEffect = (callable: ThenableEffectCallback): ReturnType<EffectCallback> => {
  const called = callable()

  // if result is void
  if (!called) return void 0

  // if result is promise like, return void
  if (isThenable(called)) return void 0

  return called
}
