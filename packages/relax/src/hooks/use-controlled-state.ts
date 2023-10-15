import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { isStateGetter, type State } from '../utils/is-state-getter'
import { isUndefined } from '../utils/is-undefined'

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
    if (isStateGetter(controlledState)) return controlledState()

    if (isUndefined(controlledState)) {
      if (isUndefined(defaultState)) return controlledState
      if (isStateGetter(defaultState)) return defaultState()
      return defaultState
    }

    return controlledState
  })

  useEffect(() => {
    // when state is not controlled
    if (isUndefined(controlledState)) return
    // if state is equal with value
    if (controlledState === state) return
    /// update inner state
    setState(controlledState)
  }, [controlledState])

  return [state, setState]
}
