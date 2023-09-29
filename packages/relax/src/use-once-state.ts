import { useState } from 'react'

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useOnceState = <T>(initialState: T | (() => T)) => {
  return useState<T>(initialState)[0]
}
