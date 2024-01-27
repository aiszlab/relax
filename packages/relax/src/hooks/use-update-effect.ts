import { DependencyList, useEffect, useRef } from 'react'
import { useMounted } from './use-mounted'
import { ThenableEffectCallback, callAsEffect } from '../utils/thenable-effect-callback'

export const useUpdateEffect = (callable: ThenableEffectCallback, deps?: DependencyList) => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) return
    return callAsEffect(callable)
  }, deps)

  useMounted(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  })
}
