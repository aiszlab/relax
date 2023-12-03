import { Key, useCallback, useRef } from 'react'

/**
 * @description
 * scrollable hook
 */
export const useScrollable = <P extends HTMLElement, C extends HTMLElement>() => {
  const groupRef = useRef<P>(null)
  const itemRefs = useRef<Map<Key, C | null>>(new Map())
  const scroller = useRef<number | null>(null)

  const scrollTo = useCallback((to: number, duration = 0) => {
    if (scroller.current) {
      cancelAnimationFrame(scroller.current)
    }

    const group = groupRef.current
    if (!group) return

    // if duration <= 0, jump immediately
    if (duration <= 0) {
      scroller.current = requestAnimationFrame(() => {
        group.scrollTop = to
      })
      return
    }

    // animate
    const difference = to - group.scrollTop
    const step = (difference / duration) * 10

    scroller.current = requestAnimationFrame(() => {
      group.scrollTop = group.scrollTop + step
      if (group.scrollTop === to) return
      scrollTo(to, duration - 10)
    })
  }, [])

  const to = useCallback((key: Key) => {
    const item = itemRefs.current.get(key)
    if (!item) return 0
    return item.offsetTop
  }, [])

  return {
    groupRef,
    itemRefs,
    scrollTo,
    to
  }
}
