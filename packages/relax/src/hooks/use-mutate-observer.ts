import { useEffect } from 'react'
import { useEvent } from './use-event'
import { isDomUsable } from '../is/is-dom-usable'
import { toArray } from '../utils/to-array'
export const useMutateObserver = (_elements: HTMLElement | HTMLElement[] | null, _callback: MutationCallback) => {
  const callback = useEvent(_callback)

  useEffect(() => {
    if (!isDomUsable() || !_elements) {
      return
    }

    const elements = toArray(_elements)
    const listener = new MutationObserver(callback)

    elements.forEach((element) => {
      listener.observe(element, { subtree: true, childList: true, attributeFilter: ['style', 'class'] })
    })

    return () => {
      listener.takeRecords()
      listener.disconnect()
    }
  }, [_elements, callback])
}
