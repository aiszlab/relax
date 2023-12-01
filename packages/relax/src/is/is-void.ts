import { isUndefined } from './is-undefined'
import { isNull } from './is-null'

/**
 * @description
 * is null or undefined
 */
export const isVoid = (value: unknown): value is null | undefined => {
  return isNull(value) || isUndefined(value)
}
