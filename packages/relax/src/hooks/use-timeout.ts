import { useEffect } from 'react'

interface Options {
  duration: number
}

/**
 * @author murukal
 *
 * @description
 * timeout effect
 */
export const useTimeout = (handler: Function, { duration }: Options) => {
  useEffect(() => {
    const timer = setTimeout(handler, duration)

    return () => {
      if (!timer) return
      clearTimeout(timer)
    }
  }, [duration])
}
