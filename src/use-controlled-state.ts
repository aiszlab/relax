import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
export const useControlledState = <T>(value: T): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState(value)

  useEffect(() => {
    // when state is not controlled
    if (value === void 0) {
      return
    }

    // if state is equal with value
    if (value === state) {
      return
    }

    setState(value)
  }, [value])

  return [state, setState]
}
