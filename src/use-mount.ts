import { EffectCallback, useLayoutEffect } from 'react'
import { VoidAsyncCallable } from '../types'

export const useMount = (callable: EffectCallback | VoidAsyncCallable) => {
  useLayoutEffect(() => {
    const called = callable()
    const isPromise = called instanceof Promise

    if (isPromise) return
    return called
  }, [])
}
