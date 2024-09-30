import { isHex } from "./is-hex";
import { toArray } from "@aiszlab/relax";

/**
 * @description
 * hex color convert to rgba color
 */
export const hexToRgba = (input: string) => {
  if (!isHex(input)) {
    throw new Error("fuzzy.color: hex color is invalid!");
  }

  // exclude '#': charCode = 35
  const _hex = toArray(input.slice(input.charCodeAt(0) === 35 ? 1 : 0), { separator: "" });
  // fill alpha
  if ([3, 6].includes(_hex.length)) {
    _hex.push("f", "f");
  }

  // fill when hex shortcut
  if (_hex.length === 5) {
    const shortcuts = _hex.splice(0, 3);
    _hex.unshift(
      ...shortcuts.reduce<string[]>((prev, _item) => {
        prev.push(_item, _item);
        return prev;
      }, []),
    );
  }

  const hex = _hex.join("");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const alpha = (parseInt(hex.slice(-2), 16) / 255).toFixed(2);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
