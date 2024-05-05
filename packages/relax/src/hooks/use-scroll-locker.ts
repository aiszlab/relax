import { useLayoutEffect } from 'react'
import { isOverflow } from '../is/is-overflow'
import { setStyle } from '../utils/set-style'

type ScrollBarSize = {
  width: number
  height: number
}

class ScrollLocker {
  // singleton mode
  static #scrollLocker: ScrollLocker | null = null
  // bar size
  #barSize: ScrollBarSize | null = null
  // locked elements, with previous styles
  #locked: Map<Element, Partial<CSSStyleDeclaration>> = new Map()

  constructor() {
    return (ScrollLocker.#scrollLocker ??= this)
  }

  get barSize() {
    if (this.#barSize) return this.#barSize

    // how to calculate dom scroll bar size
    // create a backend dom element, set force scrollable
    const _target = document.createElement('div')
    _target.attributeStyleMap.set('position', 'absolute')
    _target.attributeStyleMap.set('left', '0')
    _target.attributeStyleMap.set('top', '0')
    _target.attributeStyleMap.set('width', '100vw')
    _target.attributeStyleMap.set('height', '100vh')
    _target.attributeStyleMap.set('overflow', 'scroll')

    // calculate, then clear
    document.body.appendChild(_target)
    this.#barSize = {
      width: _target.offsetWidth - _target.clientWidth,
      height: _target.offsetHeight - _target.clientHeight
    }
    document.body.removeChild(_target)
    return this.#barSize
  }

  get isOverflow() {
    return isOverflow()
  }

  lock(element: HTMLElement = document.body) {
    // if locked, do not lock again
    if (this.#locked.has(element)) return

    // if target is not scrollable, do not lock
    if (element.scrollHeight <= element.clientHeight) return

    this.#locked.set(
      element,
      setStyle(element, {
        overflow: 'hidden',
        width: `calc(100% - ${this.barSize.width}px)`
      })
    )
  }

  unlock(element: HTMLElement = document.body) {
    // not locked, no need to unlock
    if (!this.#locked.has(element)) return

    // reset style, in lock, some styled are setted
    setStyle(element, this.#locked.get(element))
    this.#locked.delete(element)
  }
}

/**
 * @description
 * hooks
 */
export const useScrollLocker = (isLock?: boolean) => {
  useLayoutEffect(() => {
    const scrollLocker = new ScrollLocker()

    if (!!isLock) {
      scrollLocker.lock(document.body)
    } else {
      scrollLocker.unlock(document.body)
    }

    return () => {
      scrollLocker.unlock(document.body)
    }
  }, [!!isLock])
}
