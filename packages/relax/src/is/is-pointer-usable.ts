/**
 * @description
 * if pointer event is usable
 */
export const isPointerUsable = () => {
  return typeof PointerEvent !== "undefined";
};
