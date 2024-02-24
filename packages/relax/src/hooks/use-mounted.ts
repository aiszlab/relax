import { useEffect } from 'react'
import { effect } from '../utils/effect'
import type { ThenableEffectCallback } from '../types'

/**
 * @author murukal
 *
 * @description
 * when components mounted
 */
export const useMounted = (callable: ThenableEffectCallback) => {
  useEffect(() => {
    return effect(callable)
  }, [])
}
