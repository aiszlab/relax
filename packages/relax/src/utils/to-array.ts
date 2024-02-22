/**
 * @description
 * convert any type data to a array
 */
export const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value
  }
  return [value as T]
}
