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
    const { width, height } = getComputedStyle(document.body, '::-webkit-scrollbar')
    return (this.#barSize ??= {
      width: isComputable(width) ? width : '0',
      height: isComputable(height) ? height : '0'
    })
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
