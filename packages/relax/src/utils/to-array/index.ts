import { isVoid } from '../../is/is-void'

/**
 * @description
 * options
 */
type Options = {
  /**
   * @description
   * separator
   * only effect in `value is string`, value would be split by separator
   */
  separator?: string
}

/**
 * @description
 * convert any type data to a array
 */
export const toArray = <T extends unknown = unknown>(value: T | Array<T>, { separator }: Options = {}): Array<T> => {
  if (Array.isArray(value)) {
    return value
  }

  switch (typeof value) {
    case 'string':
      if (isVoid(separator)) {
        return [value]
      }
      return value.split(separator) as T[]
    default:
      return [value]
  }
}
