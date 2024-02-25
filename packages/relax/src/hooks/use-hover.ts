import { useBoolean } from '../hooks/use-boolean'
import { useEvent } from '../hooks/use-event'

export const useHover = () => {
  const { isOn: isHovered, turnOff, turnOn } = useBoolean(false)

  const onPointerEnter = useEvent(() => {
    turnOn()
  })

  const onPointerLeave = useEvent(() => {
    turnOff()
  })

  return {
    isHovered,
    onPointerEnter,
    onPointerLeave
  }
}
