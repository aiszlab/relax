import { useEffect, useRef } from 'react'

interface Options {
  duration: number
}

/**
 * @author murukal
 *
 * @description
 * timeout effect
 */
export const useTimeout = (handler: UnderlyingSinkCloseCallback, { duration }: Options) => {
  const timer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    timer.current = setTimeout(handler, duration)

    return () => {
      if (!timer.current) return
      clearTimeout(timer.current)
    }
  }, [duration])
}
