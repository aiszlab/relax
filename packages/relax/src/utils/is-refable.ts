import { type ReactNode, isValidElement } from 'react'
import { isMemo, isFragment } from 'react-is'

/**
 * @description
 */
export const isRefable = (node: ReactNode): boolean => {
  if (!isValidElement(node)) {
    return false
  }

  if (isFragment(node)) {
    return false
  }

  return _RefableElement(node)
}

/**
 * @description
 * refable element
 */
const _RefableElement = (element: any) => {
  const type = isMemo(element) ? element.type.type : element.type

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render) {
    return false
  }

  // Class component
  if (typeof element === 'function' && !element.prototype?.render) {
    return false
  }

  return true
}
