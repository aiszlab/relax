import { useCallback } from 'react'
import { useBoolean } from '../hooks/use-boolean'

type UsedHover = [
  boolean,
  {
    onPointerEnter: () => void
    onPointerLeave: () => void
  }
]

export const useHover = (): UsedHover => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false)

  const onPointerEnter = useCallback(() => {
    turnOn()
  }, [])

  const onPointerLeave = useCallback(() => {
    turnOff()
  }, [])

  return [isHovered, { onPointerEnter, onPointerLeave }]
}
