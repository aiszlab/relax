import { type Key, useCallback, useRef } from 'react'
import { type Direction, scrollTo as _scrollTo } from '../dom/scroll-to'

interface Dependencies {
  direction?: Direction
}

/**
 * @description
 * scrollable hook
 */
export const useScrollable = <P extends HTMLElement, C extends HTMLElement>({
  direction = 'vertical'
}: Dependencies = {}) => {
  const triggerRef = useRef<P>(null)
  const targetRefs = useRef<Map<Key, C | null>>(new Map())

  const scrollTo = useCallback(
    (to: number, duration = 0) => {
      const trigger = triggerRef.current
      if (!trigger) return

      // use animated scroll
      _scrollTo(trigger, to, {
        duration,
        direction
      })
    },
    [direction]
  )

  const to = useCallback(
    (key: Key) => {
      const item = targetRefs.current.get(key)
      if (!item) return 0
      // different direction, use different property
      return direction === 'vertical' ? item.offsetTop : item.offsetLeft
    },
    [direction]
  )

  return {
    triggerRef,
    targetRefs,
    scrollTo,
    to
  }
}
