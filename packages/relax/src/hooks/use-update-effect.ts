import { DependencyList, useEffect, useRef } from 'react'
import { useMounted } from './use-mounted'
import { effect } from '../utils/effect'
import type { ThenableEffectCallback } from '@aiszlab/tatoba'

export const useUpdateEffect = (callable: ThenableEffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) return
    return effect(callable)
  }, deps)

  useMounted(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })
}
