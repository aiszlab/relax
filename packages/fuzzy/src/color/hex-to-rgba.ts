import { fromHex } from "./from-hex";

/**
 * @description
 * hex color convert to rgba color
 */
export const hexToRgba = (input: string, alpha?: number) => {
  const { red, green, blue, alpha: _alpha } = fromHex(input);
  return `rgba(${red}, ${green}, ${blue}, ${alpha ?? _alpha ?? 1})`;
};
