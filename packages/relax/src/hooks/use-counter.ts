import { useCallback, useMemo, useState } from 'react'
import { clamp } from '../utils/clamp'

interface Props {
  /**
   * @description
   * initial value
   */
  initialValue?: number

  /**
   * @description
   * max
   */
  max?: number

  /**
   * @description
   * min
   */
  min?: number
}

/**
 * @author murukal
 *
 * @description
 * a number counter with some useful apis
 */
export const useCounter = (
  { max = Infinity, min = 0, ...props }: Props = { initialValue: 0, max: Infinity, min: 0 }
) => {
  const initialValue = useMemo(() => clamp(props.initialValue ?? 0, min, max), [max, min, props.initialValue])
  const [count, setCount] = useState(initialValue)

  const next = useCallback(
    (step = 1) => {
      setCount((prev) => Math.min(max, prev + step))
    },
    [max]
  )

  const prev = useCallback(
    (step = 1) => {
      setCount((prev) => Math.max(prev - step))
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
    setCount(initialValue)
  }, [initialValue])

  return {
    count,
    next,
    prev,
    first,
    last,
    reset,
    setCount
  }
}
