import { type MutableRefObject, type RefCallback, useMemo } from 'react'
import { isFunction } from '../is/is-function'
import type { Nullable } from '../utils/null-able'

type Refable<T> = RefCallback<T> | MutableRefObject<T>

const mount = <T>(ref: Refable<T>, trigger: T) => {
  if (isFunction(ref)) {
    ref(trigger)
    return
  }
  ref.current = trigger
}

export const useRefs = <T>(...refs: Nullable<Refable<Nullable<T>>>[]) => {
  return useMemo(() => {
    return (trigger: T) => {
      refs.forEach((ref) => {
        if (!ref) return
        mount(ref, trigger)
      })
    }
  }, refs)
}
