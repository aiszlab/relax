import type { Voidable } from "@aiszlab/relax/types";

type _Style = Record<string, string>;

/**
 * @description
 * set inline style util
 */
export const setStyle = (
  element: HTMLElement,
  styles: Voidable<Partial<CSSStyleDeclaration>>,
): Partial<CSSStyleDeclaration> => {
  if (!styles) return {};

  return Object.entries(styles).reduce<_Style>((prev, [key, value]) => {
    prev[key] = (element.style as unknown as _Style)[key];
    (element.style as unknown as _Style)[key] = value as string;
    return prev;
  }, {});
};
