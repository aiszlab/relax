import { type MutableRefObject, type RefCallback, useMemo } from 'react'
import { isFunction } from '../is/is-function'

type Refable<T> = RefCallback<T> | MutableRefObject<T>

const mount = <T>(ref: Refable<T>, trigger: T) => {
  if (isFunction(ref)) {
    ref(trigger)
    return
  }
  ref.current = trigger
}

export const useRefs = <T>(...refs: Refable<T>[]) => {
  return useMemo(() => {
    return (trigger: T) => {
      refs.forEach((ref) => {
        mount(ref, trigger)
      })
    }
  }, refs)
}
