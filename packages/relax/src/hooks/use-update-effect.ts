import { type DependencyList, useEffect, useRef } from 'react'
import { useMounted } from './use-mounted'
import { effect } from '../utils/effect'
import type { ThenableEffectCallback } from '../types'

export const useUpdateEffect = (callback: ThenableEffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) return
    return effect(callback)
  }, deps)

  useMounted(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })
}
