type Direction = 'horizontal' | 'vertical'

class Scroller {
  #scrolled = new Map<HTMLElement, number>()

  // singleton mode
  #scroller: Scroller | null = null

  constructor() {
    return (this.#scroller ??= this)
  }

  get scrolled() {
    return this.#scrolled
  }

  currentAt(direction: Direction): Extract<keyof HTMLElement, 'scrollTop' | 'scrollLeft'> {
    return direction === 'vertical' ? 'scrollTop' : 'scrollLeft'
  }
}

interface ScrollBy {
  /**
   * @description
   * duration
   */
  duration: number

  /**
   * @description
   * direction
   */
  direction?: Direction
}

/**
 * @description
 * scroll to for wrapper element
 */
export const scrollTo = (
  trigger: HTMLElement,
  to: number,
  { duration = 0, direction = 'vertical' }: ScrollBy = {
    duration: 0,
    direction: 'vertical'
  }
): void => {
  const scroller = new Scroller()
  const scrolled = scroller.scrolled.get(trigger)
  const currentAtProperty = scroller.currentAt(direction)

  if (scrolled) {
    cancelAnimationFrame(scrolled)
    scroller.scrolled.delete(trigger)
  }

  // if duration <= 0, jump immediately
  if (duration <= 0) {
    scroller.scrolled.set(
      trigger,
      requestAnimationFrame(() => {
        trigger[currentAtProperty] = to
      })
    )
    return
  }

  // animate
  const currentAt = trigger[currentAtProperty]
  const difference = to - currentAt
  const step = (difference / duration) * 10

  scroller.scrolled.set(
    trigger,
    requestAnimationFrame(() => {
      trigger[currentAtProperty] = currentAt + step

      if (trigger[currentAtProperty] === to) return

      scrollTo(trigger, to, {
        duration: duration - 10,
        direction
      })
    })
  )
}
