import { useBoolean } from '../hooks/use-boolean'
import { useEvent } from '../hooks/use-event'

type UsedHover = [
  boolean,
  {
    onPointerEnter: () => void
    onPointerLeave: () => void
  }
]

export const useHover = (): UsedHover => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false)

  const onPointerEnter = useEvent(() => {
    turnOn()
  })

  const onPointerLeave = useEvent(() => {
    turnOff()
  })

  return [isHovered, { onPointerEnter, onPointerLeave }]
}
