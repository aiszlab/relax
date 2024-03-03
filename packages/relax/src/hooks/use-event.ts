import { useRef, useCallback } from 'react'
import type { Arguments } from '../types'

export const useEvent = <T extends Function>(callback: T): T => {
  const ref = useRef<T>(callback)
  ref.current = callback

  return useCallback(((...args: Arguments<T>) => ref.current(...args)) as unknown as T, [])
}
