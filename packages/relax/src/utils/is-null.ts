/**
 * @description
 * is null
 */
export const isNull = (value: unknown): value is null => {
  return value === null
}
