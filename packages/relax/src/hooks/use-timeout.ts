import { useEffect } from 'react'

/**
 * @author murukal
 *
 * @description
 * timeout effect
 */
export const useTimeout = (handler: Function, wait: number) => {
  useEffect(() => {
    const timer = setTimeout(handler, wait)

    return () => {
      if (!timer) return
      clearTimeout(timer)
    }
  }, [wait])
}
