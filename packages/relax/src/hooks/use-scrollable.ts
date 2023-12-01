import { Key, useCallback, useRef } from 'react'

/**
 * @description
 * scrollable hook
 */
export const useScrollable = <P extends HTMLElement, C extends HTMLElement>() => {
  const groupRef = useRef<P>(null)
  const itemRefs = useRef<Map<Key, C | null>>(new Map())
  const scroller = useRef<number | null>(null)

  const scrollTo = useCallback((key: Key, duration = 0) => {
    if (scroller.current) {
      cancelAnimationFrame(scroller.current)
    }

    const group = groupRef.current
    if (!group) return
    const item = itemRefs.current.get(key)
    if (!item) return
    const to = item.offsetTop

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
      scrollTo(key, duration - 10)
    })
  }, [])

  return {
    groupRef,
    itemRefs,
    scrollTo
  }
}
