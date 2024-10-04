import { toArray } from "@aiszlab/relax";
import { isHex } from "./is-hex";
import type { Rgba } from "./types";

/**
 * @description
 * from hex
 */
export const fromHex = (input: string): Rgba => {
  if (!isHex(input)) {
    throw new Error("Invalid hex color");
  }

  // exclude '#': charCode = 35
  const _hex = toArray(input.slice(input.charCodeAt(0) === 35 ? 1 : 0), { separator: "" });

  // using shortcut hex
  // like "#fff", to "#ffffff"
  if ([3, 5].includes(_hex.length)) {
    const shortcuts = _hex.splice(0, 3);

    _hex.unshift(
      ...shortcuts.reduce<string[]>((prev, _item) => {
        prev.push(_item, _item);
        return prev;
      }, []),
    );
  }

  const hex = _hex.join("");
  const _alpha = hex.slice(6, 8);

  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: _alpha ? Number((parseInt(_alpha, 16) / 255).toFixed(2)) : void 0,
  };
};
