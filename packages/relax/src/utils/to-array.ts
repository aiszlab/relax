/**
 * @description
 * convert any type data to a array
 */
export const toArray = <T extends unknown = unknown>(value: T | Array<T>): Array<T> => {
  if (Array.isArray(value)) {
    return value
  }
  return [value]
}
