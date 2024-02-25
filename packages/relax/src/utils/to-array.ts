/**
 * @description
 * convert any type data to a array
 */
export const toArray = <T extends Array<unknown>>(value: unknown): T => {
  if (Array.isArray(value)) {
    return value as T
  }
  return [value] as T
}
