import { fromHex } from "./from-hex";

/**
 * @description
 * hex color convert to rgba color
 */
export const hexToRgba = (input: string, alpha?: number) => {
  const { r, g, b, a: _alpha } = fromHex(input);
  return `rgba(${r}, ${g}, ${b}, ${alpha ?? _alpha ?? 1})`;
};
