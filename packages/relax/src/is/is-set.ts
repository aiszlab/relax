/**
 * @description
 * is set
 */
export const isSet = (value: unknown): value is Set<unknown> => {
  return value instanceof Set;
};
