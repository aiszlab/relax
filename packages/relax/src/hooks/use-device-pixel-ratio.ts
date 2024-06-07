import { useState } from 'react'

/**
 * @description
 * devicePixelRatio
 * in different device, ratio
 */
export const useDevicePixelRatio = () => {
  const [devicePixelRatio] = useState(window.devicePixelRatio)

  return devicePixelRatio
}
