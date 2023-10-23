import { isVoid } from '..'
import { isArray } from './is-array'

/**
 * @author murukal
 *
 * @description
 * is empty
 */
export const isEmpty = (value?: Object | unknown[] | string | number | boolean | null) => {
  // null or undefined
  if (isVoid(value)) return true

  // object
  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  // array
  if (isArray(value)) {
    return value.length === 0
  }

  return !!value
}
