import { EffectCallback, useEffect } from 'react'
import { callAsEffect } from '../utils/thenable-effect-callback'

/**
 * @author murukal
 *
 * @description
 * when components mounted
 */
export const useMounted = (callable: EffectCallback | UnderlyingSinkCloseCallback) => {
  useEffect(() => {
    return callAsEffect(callable)
  }, [])
}
