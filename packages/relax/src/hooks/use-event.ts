import { useRef, useCallback } from 'react'

type Callable<U extends Array<unknown>, R> = (...args: U) => R

export const useEvent = <U extends Array<unknown>, R>(callable: Callable<U, R>): Callable<U, R> => {
  const ref = useRef<Callable<U, R>>()
  ref.current = callable

  return useCallback((...args: U) => ref.current!(...args), [])
}
