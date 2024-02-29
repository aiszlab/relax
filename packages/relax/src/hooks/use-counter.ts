import { useCallback, useMemo, useState } from 'react'
import { clamp } from '../utils/clamp'
import type { State } from '../types'
import { useDefault } from '..'

type Props = {
  /**
   * @description
   * initial value
   */
  initialState?: State<number>

  /**
   * @description
   * max: count will not be greater than max
   */
  max?: number

  /**
   * @description
   * min: count will not be smaller than min
   */
  min?: number
}

type UsedCounter = [
  number,
  {
    add: (step?: number) => void
    subtract: (step?: number) => void
    first: () => void
    last: () => void
    reset: () => void
  }
]

/**
 * @author murukal
 *
 * @description
 * a number counter with some useful apis
 */
export const useCounter = (
  initialState?: State<number>,
  { max = Infinity, min = 0 }: Props = { max: Infinity, min: 0 }
): UsedCounter => {
  const defaultState = useDefault(initialState ?? 0)
  const [count, setCount] = useState(defaultState)

  const add = useCallback(
    (step = 1) => {
      setCount((prev) => Math.min(max, prev + step))
    },
    [max]
  )

  const subtract = useCallback(
    (step = 1) => {
      setCount((prev) => Math.max(min, prev - step))
    },
    [min]
  )

  const first = useCallback(() => {
    setCount(min)
  }, [min])

  const last = useCallback(() => {
    setCount(max)
  }, [max])

  const reset = useCallback(() => {
    setCount(defaultState)
  }, [])

  return [count, { add, subtract, first, last, reset }]
}
