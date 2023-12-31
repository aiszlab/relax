import { EffectCallback, useLayoutEffect } from 'react'
import { callAsEffect } from '../utils/thenable-effect-callback'

/**
 * @author murukal
 *
 * @description
 * when components will mount
 */
export const useMount = (callable: EffectCallback | UnderlyingSinkCloseCallback) => {
  useLayoutEffect(() => {
    return callAsEffect(callable)
  }, [])
}
