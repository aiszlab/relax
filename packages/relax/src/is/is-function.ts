/**
 * @description
 * if is function
 */
const isFunction = (value: unknown): value is Function => {
  return typeof value === "function";
};

export { isFunction };
