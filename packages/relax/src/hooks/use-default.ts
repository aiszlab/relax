import { useMemo } from 'react'
import { isStateGetter, type State } from '../is/is-state-getter'

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useDefault = <T>(initialState: State<T>) => {
  return useMemo(() => {
    if (isStateGetter(initialState)) {
      return initialState()
    } else {
      return initialState
    }
  }, [])
}
