import { DOMAttributes, useCallback } from 'react'
import { useBoolean } from '../hooks/use-boolean'
import { chain } from '../utils/chain'
import type { Last } from '../types'

type UseHoverBy<T> = {
  onEnter?: DOMAttributes<T>['onPointerEnter']
  onLeave?: DOMAttributes<T>['onPointerLeave']
}

type UsedHover<T> = [boolean, Required<Pick<DOMAttributes<T>, 'onPointerEnter' | 'onPointerLeave'>>]

export const useHover = <T extends Element = Element>(props?: UseHoverBy<T>): UsedHover<T> => {
  const [isHovered, { turnOn, turnOff }] = useBoolean(false)

  const onPointerEnter = useCallback<Last<UsedHover<T>>['onPointerEnter']>(
    (e) => {
      chain(props?.onEnter, turnOn)(e)
    },
    [props?.onEnter]
  )

  const onPointerLeave = useCallback<Last<UsedHover<T>>['onPointerLeave']>(
    (e) => {
      chain(props?.onLeave, turnOff)(e)
    },
    [props?.onLeave]
  )

  return [isHovered, { onPointerEnter, onPointerLeave }]
}
