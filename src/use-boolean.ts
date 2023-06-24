import { useCallback, useState } from 'react'

export const useBoolean = () => {
  const [isOn, setIsOn] = useState(false)

  const turnOn = useCallback(() => setIsOn(true), [])
  const turnOff = useCallback(() => setIsOn(false), [])

  const toggle = useCallback(() => setIsOn((prev) => !prev), [])

  return {
    isOn,
    turnOn,
    turnOff,
    toggle
  }
}
