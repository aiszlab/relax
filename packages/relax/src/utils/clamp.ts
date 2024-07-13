/**
 * @description
 * get mid value
 * @param value number
 * @param min number
 * @param max number
 * @returns number
 */
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};
