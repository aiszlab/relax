import { useCallback, useState, type Dispatch, type SetStateAction } from 'react'
import type { State } from "../types";

type UsedBoolean = [boolean, {
  turnOn: () => void
  turnOff: () => void
  toggle: () => void
  setBoolean: Dispatch<SetStateAction<boolean>>
}]

/**
 * @author murukal
 *
 * @description
 * boolean state, in relax, we already create some api to easy use
 */
export const useBoolean = (initialState?: State<boolean>): UsedBoolean => {
  const [isOn, setIsOn] = useState(initialState ?? false)

  const turnOn = useCallback(() => setIsOn(true), [])

  const turnOff = useCallback(() => setIsOn(false), [])

  const toggle = useCallback(() => setIsOn((_isOn) => !_isOn), [])

  return [isOn, {
    turnOn,
    turnOff,
    toggle,
    setBoolean: setIsOn
  }]
}
