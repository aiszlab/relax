import { useState } from 'react'
import { isDomUsable } from '../is/is-dom-usable'

/**
 * @description
 * devicePixelRatio
 * in different device, ratio
 */
export const useDevicePixelRatio = () => {
  const [devicePixelRatio] = useState(() => {
    if (!isDomUsable()) return 1
    return window.devicePixelRatio
  })

  return devicePixelRatio
}
