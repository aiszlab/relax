import { type Dispatch, type SetStateAction, useState } from 'react'
import type { State } from '../types'
import { isStateGetter } from '../is/is-state-getter'
import { isUndefined } from '../is/is-undefined'
import { useUpdateEffect } from './use-update-effect'

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
  controlledState: T,
  { defaultState }: Props<T> = {}
): [T, Dispatch<SetStateAction<T>>] => {
  /// initialize state
  const [_state, _setState] = useState<T>(() => {
    // default use controlled state
    if (!isUndefined(controlledState)) {
      return controlledState
    }

    // not controlled use default prop
    if (isUndefined(defaultState)) return controlledState
    if (isStateGetter(defaultState)) return defaultState()
    return defaultState
  })

  /// sync value back to `undefined` when it from control to un-control
  useUpdateEffect(() => {
    if (!isUndefined(controlledState)) return
    _setState(controlledState)
  }, [controlledState])

  /// use controlled
  const state = !isUndefined(controlledState) ? controlledState : _state

  return [state, _setState]
}
