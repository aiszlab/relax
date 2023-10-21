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
export const useControlledState = <T>(controlledState: State<T>): [T, Dispatch<SetStateAction<T>>] => {
  /// initialize state
  const [state, setState] = useState<T>(() => {
    if (isStateGetter(controlledState)) return controlledState()
    return controlledState
  })

  useEffect(() => {
    // when state is not controlled
    if (isUndefined(controlledState)) return
    // if input state is function, mean it is not controlled
    if (isStateGetter(controlledState)) return
    // if state is equal with value
    if (controlledState === state) return
    /// update inner state
    setState(controlledState)
  }, [controlledState])

  return [state, setState]
}
