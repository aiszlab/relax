/**
 * @description
 * is undefined
 */
export const isUndefined = (value: unknown): value is undefined => {
  return value === void 0;
};
