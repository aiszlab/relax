import { fromHex } from "./from-hex";

/**
 * @description
 * hex color convert to hsla color
 */
export const hexToHsla = (input: string, alpha?: number) => {
  const { r: _r, g: _g, b: _b, a: _alpha } = fromHex(input);

  const r = _r / 255;
  const g = _g / 255;
  const b = _b / 255;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  const delta = max - min;

  let h: number = 0;
  let s: number = 0;
  const l = (min + max) / 2;

  if (max === min) {
    h = 0;
  } else if (r === max) {
    h = (g - b) / delta;
  } else if (g === max) {
    h = 2 + (b - r) / delta;
  } else if (b === max) {
    h = 4 + (r - g) / delta;
  }

  h = Math.min(h * 60, 360);

  if (h < 0) {
    h += 360;
  }

  if (max === min) {
    s = 0;
  } else if (l <= 0.5) {
    s = delta / (max + min);
  } else {
    s = delta / (2 - max - min);
  }

  return [h, s * 100, l * 100, alpha ?? _alpha ?? 1];
};
