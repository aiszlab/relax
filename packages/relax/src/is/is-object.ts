/**
 * @description
 * is object
 */
const isObject = (value: unknown): value is Object => {
  return !!value && typeof value === "object";
};

export { isObject };
