import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { isFunction } from '../utils/state'
import type { State } from '../types/state'

interface Props<T> {
  defaultState?: State<T>
}

/**
 * @author murukal
 *
 * @description
 * controlled state
 */
export const useControlledState = <T>(
  controlledState: State<T>,
  props?: Props<T>
): [T, Dispatch<SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    if (isFunction(controlledState)) {
      return controlledState()
    }

    if (controlledState === void 0) {
      if (props?.defaultState === void 0) {
        return controlledState
      }

      if (isFunction(props.defaultState)) {
        return props.defaultState()
      }

      return props.defaultState
    }

    return controlledState
  })

  useEffect(() => {
    // when state is not controlled
    if (controlledState === void 0) {
      return
    }

    // if state is equal with value
    if (controlledState === state) {
      return
    }

    setState(controlledState)
  }, [controlledState])

  return [state, setState]
}
