/**
 * @description
 * string/number/... is primitive type
 */
export const isPrimitive = (value: unknown) => {
  return value !== Object(value);
};
