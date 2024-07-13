/**
 * @description
 * is set
 */
export const isMap = (value: unknown): value is Map<unknown, unknown> => {
  return value instanceof Map
}
