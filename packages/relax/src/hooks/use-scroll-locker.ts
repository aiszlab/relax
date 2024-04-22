import { useId, useLayoutEffect } from 'react'
import { isOverflow } from '../is/is-overflow'
import { isStyleElement } from '../is/is-style-element'

const isComputable = (value: string) => /^(.*)px$/.test(value)

class ScrollLocker {
  // singleton mode
  static #scrollLocker: ScrollLocker | null = null

  // bar size
  #barSize: Pick<CSSStyleDeclaration, 'width' | 'height'> | null = null

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
    const scrollWidth = _target.offsetWidth - _target.clientWidth
    const scrollHeight = _target.offsetHeight - _target.clientHeight
    document.body.removeChild(_target)

    return {
      width: scrollWidth,
      height: scrollHeight
    }
  }

  get isOverflow() {
    return isOverflow()
  }

  get locker() {
    return `html body {
  overflow-y: hidden;
  ${this.isOverflow ? `width: calc(100% - ${this.barSize.width});` : ''}
}`
  }

  get container() {
    return document.head || document.body
  }

  getLocked(id: string) {
    return (
      Array.from(this.container.children).filter((element) => isStyleElement(element)) as HTMLStyleElement[]
    ).find((element) => element.id === id)
  }

  lock(id: string) {
    if (!this.container) return

    const locked = this.getLocked(id)
    if (locked) {
      if (locked.innerHTML !== this.locker) {
        locked.innerHTML = this.locker
      }
      return locked
    }

    const locker = document.createElement('style')
    locker.id = id
    locker.innerHTML = this.locker
    this.container.appendChild(locker)
    return locker
  }

  unlock(id: string) {
    const locked = this.getLocked(id)
    if (!locked) return
    this.container.removeChild(locked)
  }
}

export const useScrollLocker = (isLock?: boolean) => {
  const id = useId()

  useLayoutEffect(() => {
    const scrollLocker = new ScrollLocker()

    if (!!isLock) {
      scrollLocker.lock(id)
    } else {
      scrollLocker.unlock(id)
    }

    return () => {
      scrollLocker.unlock(id)
    }
  }, [!!isLock, id])
}
