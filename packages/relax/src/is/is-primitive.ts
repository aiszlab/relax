export type Primitive = string | number | symbol | boolean | null | undefined;

/**
 * @description
 * primitive type
 * string | number | symbol | boolean | null | undefined
 */
export const isPrimitive = <T extends Primitive>(value: unknown): value is T => {
  return value !== Object(value);
};
