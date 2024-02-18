import { useRef, useCallback } from 'react'
import { Arguments } from '../utils/arguments'

export const useEvent = <T extends Function>(callable: T): T => {
  const ref = useRef<T>(callable)
  ref.current = callable

  return useCallback(((...args: Arguments<T>) => ref.current(...args)) as unknown as T, [])
}
