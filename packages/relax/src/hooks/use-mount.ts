import { EffectCallback, useLayoutEffect } from 'react'
import { effect } from '../utils/effect'

/**
 * @author murukal
 *
 * @description
 * when components will mount
 */
export const useMount = (callable: EffectCallback | UnderlyingSinkCloseCallback) => {
  useLayoutEffect(() => {
    return effect(callable)
  }, [])
}
