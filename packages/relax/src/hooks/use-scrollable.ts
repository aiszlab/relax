import { Key, useCallback, useRef } from 'react'

type Direction = 'horizontal' | 'vertical'

interface Props {
  direction?: Direction
}

const PROPERTY = new Map<
  Direction,
  {
    target: Extract<keyof HTMLElement, 'offsetTop' | 'offsetLeft'>
    trigger: Extract<keyof HTMLElement, 'scrollTop' | 'scrollLeft'>
  }
>([
  [
    'vertical',
    {
      trigger: 'scrollTop',
      target: 'offsetTop'
    }
  ],
  [
    'horizontal',
    {
      trigger: 'scrollLeft',
      target: 'offsetLeft'
    }
  ]
])

/**
 * @description
 * scrollable hook
 */
export const useScrollable = <P extends HTMLElement, C extends HTMLElement>({ direction = 'vertical' }: Props = {}) => {
  const groupRef = useRef<P>(null)
  const itemRefs = useRef<Map<Key, C | null>>(new Map())
  const scroller = useRef<number | null>(null)

  const scrollTo = useCallback(
    (to: number, duration = 0) => {
      if (scroller.current) {
        cancelAnimationFrame(scroller.current)
      }

      const group = groupRef.current
      if (!group) return
      const triggerProperty = PROPERTY.get(direction)!.trigger

      // if duration <= 0, jump immediately
      if (duration <= 0) {
        scroller.current = requestAnimationFrame(() => {
          group[triggerProperty] = to
        })
        return
      }

      // animate
      const currentAt = group[triggerProperty]
      const difference = to - currentAt
      const step = (difference / duration) * 10

      scroller.current = requestAnimationFrame(() => {
        group[triggerProperty] = currentAt + step
        if (group[triggerProperty] === to) return
        scrollTo(to, duration - 10)
      })
    },
    [direction]
  )

  const to = useCallback(
    (key: Key) => {
      const item = itemRefs.current.get(key)
      if (!item) return 0
      // different direction, use different property
      return item[PROPERTY.get(direction)!.target]
    },
    [direction]
  )

  return {
    groupRef,
    itemRefs,
    scrollTo,
    to
  }
}
