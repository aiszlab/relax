import { type FocusEvent, useCallback, type DOMAttributes } from 'react'
import { useBoolean } from './use-boolean'
import { chain } from '../utils/chain'

/**
 * @description
 * hooks for focus
 */
type UseFoucsBy<T> = Pick<DOMAttributes<T>, 'onFocus' | 'onBlur'> & {
  onFocusChange?: (isFocused: boolean) => void
}

/**
 * @description
 * dom attributes
 */
type UsedFocus<T> = [boolean, Required<Pick<DOMAttributes<T>, 'onFocus' | 'onBlur'>>]

export const useFoucs = <T = Element>(useBy: UseFoucsBy<T>): UsedFocus<T> => {
  const [isFocused, { turnOn, turnOff }] = useBoolean(false)

  const onFocus = useCallback(() => {
    chain(useBy.onFocus, turnOn, () => useBy.onFocusChange?.(true))()
  }, [useBy.onFocus, useBy.onFocusChange])

  const onBlur = useCallback(() => {
    chain(useBy.onBlur, turnOff, () => useBy.onFocusChange?.(false))()
  }, [useBy.onBlur, useBy.onFocusChange])

  return [isFocused, { onFocus, onBlur }]
}
