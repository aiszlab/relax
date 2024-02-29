import { useCallback } from 'react'
import { useBoolean } from './use-boolean'

type UsedFocus = [
  boolean,
  {
    onFocus: () => void
    onBlur: () => void
  }
]

export const useFoucs = (): UsedFocus => {
  const [isFocused, { turnOn, turnOff }] = useBoolean(false)

  const onFocus = useCallback(() => {
    turnOn()
  }, [])

  const onBlur = useCallback(() => {
    turnOff()
  }, [])

  return [isFocused, { onFocus, onBlur }]
}
