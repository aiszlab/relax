import { useRef, useCallback } from 'react'

type Callback<U extends Array<unknown>, R> = (...args: U) => R

export const useEvent = <U extends Array<unknown>, R>(callback: Callback<U, R>): Callback<U, R> => {
  const ref = useRef<Callback<U, R>>()
  ref.current = callback

  return useCallback((...args: U) => ref.current!(...args), [])
}
