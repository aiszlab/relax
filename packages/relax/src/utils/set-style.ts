import type { Voidable } from "@aiszlab/relax/types";

/**
 * @description
 * set inline style util
 */
export const setStyle = (target: HTMLElement, styles: Voidable<Partial<CSSStyleDeclaration>>) => {
  if (!styles) return {};

  return Object.entries(styles).reduce<Partial<CSSStyleDeclaration>>((prev, [key, value]) => {
    // @ts-ignore
    prev[key] = target.style[key];
    // @ts-ignore
    target.style[key] = value;
    return prev;
  }, {});
};
