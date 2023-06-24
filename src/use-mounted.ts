import { EffectCallback, useEffect } from 'react'
import { VoidAsyncCallable } from '../types'

export const useMounted = (callable: EffectCallback | VoidAsyncCallable) => {
  useEffect(() => {
    const called = callable()
    const isPromise = called instanceof Promise

    if (isPromise) return
    return called
  }, [])
}
