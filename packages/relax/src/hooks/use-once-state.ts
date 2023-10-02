import { useState } from 'react'
import type { State } from '../types/state'

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useOnceState = <T>(initialState: State<T>) => {
  return useState<T>(initialState)[0]
}
