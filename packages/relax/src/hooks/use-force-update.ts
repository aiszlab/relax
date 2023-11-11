import { useCallback, useState } from 'react'

/**
 * @description
 * force update
 */
export const useForceUpdate = () => {
  const [times, setTimes] = useState(1)

  const forceUpdate = useCallback(() => {
    setTimes((prev) => prev + 1)
  }, [])

  return {
    times,
    forceUpdate
  }
}
