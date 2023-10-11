/**
 * @description
 * is undefined
 */
export const isVoid = (value: unknown): value is undefined => {
  return value === void 0
}
