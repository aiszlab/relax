/**
 * @description
 * complex
 */
export const isComplex = (value: unknown): value is Object => {
  return typeof value === 'object' || typeof value === 'function'
}
