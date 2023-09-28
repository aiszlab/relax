import { useState } from 'react'

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useOnceState = <T>(initialValue: T) => {
  return useState(() => initialValue)[0]
}
