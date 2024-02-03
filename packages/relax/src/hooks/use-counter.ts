import { useCallback, useState } from 'react'

/**
 * @author murukal
 *
 * @description
 * a number counter with some useful apis
 */
export const useCounter = () => {
  const [count, setCount] = useState(0)

  const next = useCallback(() => {
    setCount((prev) => prev + 1)
  }, [])

  const prev = useCallback(() => {
    setCount((prev) => prev - 1)
  }, [])

  const first = useCallback(() => {
    setCount(0)
  }, [])

  return {
    count,
    next,
    prev,
    first
  }
}
