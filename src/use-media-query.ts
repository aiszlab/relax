import { useState } from 'react'
import { useBoolean } from './use-boolean'

enum MediaType {}

/**
 * @author murukal
 * @description 监听浏览器 media 变化，控制状态
 *
 * media 规则 @media not|only mediatype and (mediafeature and|or|not mediafeature)
 */
export const useMediaQuery = () => {
  const { isOn, turnOn, turnOff } = useBoolean()
}
