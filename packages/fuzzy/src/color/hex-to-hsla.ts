import { hexToRgba } from "./hex-to-rgba";

/**
 * @description
 * hex color convert to hsla color
 */
function hexToHsla(input: string, alpha?: number): [number, number, number, number];
function hexToHsla(input: string, alpha: number | undefined, use: "style"): string;

function hexToHsla(input: string, alpha: number | undefined, use?: "style") {
  const { 0: _r, 1: _g, 2: _b, 3: _alpha } = hexToRgba(input, alpha);

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

  const _hsla = [h, s * 100, l * 100, _alpha];

  if (use === "style") {
    return `hsla(${_hsla.join(",")})`;
  }

  return _hsla;
}

export { hexToHsla };
