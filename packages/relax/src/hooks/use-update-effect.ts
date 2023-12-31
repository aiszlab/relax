import { DependencyList, useEffect, useRef } from 'react'
import { useMounted } from '..'
import { ThenableEffectCallback, callAsEffect } from '../utils/thenable-effect-callback'

export const useUpdateEffect = (callable: ThenableEffectCallback, deps?: DependencyList) => {
  const isMounted = useRef<boolean>(false)

  useEffect(() => {
    if (!isMounted.current) return void 0
    return callAsEffect(callable)
  }, deps)

  useMounted(() => {
    isMounted.current = true
  })
}
