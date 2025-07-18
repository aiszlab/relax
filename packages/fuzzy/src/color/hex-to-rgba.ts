import { isHex } from "./is-hex";

type Rgba = Omit<readonly [number, number, number, number], "toString"> & {
  /**
   * @override toString
   * @description stringify rgba color, like "rgba(255, 255, 255, 1)"
   */
  toString(): string;
};

/**
 * @description
 * hex color convert to rgba color
 */
function hexToRgba(input: string, alpha?: number): Rgba {
  if (!isHex(input)) {
    throw new Error("Invalid hex color");
  }

  // exclude '#': charCode = 35
  const _hex = input.slice(input.charCodeAt(0) === 35 ? 1 : 0).split("");

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
  const _alpha = hex.slice(6, 8) || "ff";

  const _rgba = [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
    alpha ?? Number((parseInt(_alpha, 16) / 255).toFixed(2)),
  ] as const;

  _rgba.toString = function () {
    return `rgba(${this.join(",")})`;
  };

  return _rgba;
}

export { hexToRgba };
