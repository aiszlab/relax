import { useCallback, useState } from 'react'

/**
 * @author murukal
 *
 * @description
 * boolean state
 */
export const useBoolean = (initialValue?: boolean) => {
  const [isOn, setIsOn] = useState(initialValue || false)

  const turnOn = useCallback(() => setIsOn(true), [])
  const turnOff = useCallback(() => setIsOn(false), [])

  const toggle = useCallback(() => setIsOn((prev) => !prev), [])

  return {
    isOn,
    turnOn,
    turnOff,
    toggle,
    setIsOn
  }
}
