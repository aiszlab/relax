import { EffectCallback, useEffect } from 'react'
import { callAsEffect } from '../utils/effect'

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
