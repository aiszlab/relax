import { useCallback, type DOMAttributes } from 'react'
import { useBoolean } from './use-boolean'
import { chain } from '../utils/chain'
import type { Last } from '../types'

/**
 * @description
 * hooks for focus
 */
type UseFocusBy<T> = Pick<DOMAttributes<T>, 'onFocus' | 'onBlur'> & {
  onFocusChange?: (isFocused: boolean) => void
}

/**
 * @description
 * dom attributes
 */
type UsedFocus<T> = [boolean, Required<Pick<DOMAttributes<T>, 'onFocus' | 'onBlur'>>]

export const useFocus = <T = Element>(useBy?: UseFocusBy<T>): UsedFocus<T> => {
  const [isFocused, { turnOn, turnOff }] = useBoolean(false)

  const onFocus = useCallback<Last<UsedFocus<T>>['onFocus']>(
    (e) => {
      chain(useBy?.onFocus, turnOn, () => useBy?.onFocusChange?.(true))(e)
    },
    [useBy?.onFocus, useBy?.onFocusChange]
  )

  const onBlur = useCallback<Last<UsedFocus<T>>['onBlur']>(
    (e) => {
      chain(useBy?.onBlur, turnOff, () => useBy?.onFocusChange?.(false))(e)
    },
    [useBy?.onBlur, useBy?.onFocusChange]
  )

  return [isFocused, { onFocus, onBlur }]
}
