import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { isFunction, isVoid } from '../utils/state'
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
  { defaultState }: Props<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  /// initialize state
  const [state, setState] = useState<T>(() => {
    if (isFunction(controlledState)) return controlledState()

    if (isVoid(controlledState)) {
      if (isVoid(defaultState)) return controlledState
      if (isFunction(defaultState)) return defaultState()
      return defaultState
    }

    return controlledState
  })

  useEffect(() => {
    // when state is not controlled
    if (isVoid(controlledState)) return
    // if state is equal with value
    if (controlledState === state) return
    /// update inner state
    setState(controlledState)
  }, [controlledState])

  return [state, setState]
}
