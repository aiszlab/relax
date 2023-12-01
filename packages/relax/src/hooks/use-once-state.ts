import { useState } from 'react'
import type { State } from '../is/is-state-getter'

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useOnceState = <T>(initialState: State<T>) => {
  return useState<T>(initialState)[0]
}
