import { useRef, useState } from 'react'
import { State } from '../is/is-state-getter'

/**
 * @description
 * use reactive
 */
export const useReactive = <T>(initialState: State<T>) => {
  const [_state, _setState] = useState<T>(initialState)

  const ref = useRef(
    new Proxy(
      {
        value: _state
      },
      {
        get: () => {}
      }
    )
  )
}
