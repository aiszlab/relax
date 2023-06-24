import { useBoolean } from './use-boolean'

export const useDialog = () => {
  const { isOn, turnOff, turnOn } = useBoolean()

  return {
    isOpened: isOn,
    open: turnOn,
    close: turnOff
  }
}
