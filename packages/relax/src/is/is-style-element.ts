/**
 * @description
 * style element
 */
export const isStyleElement = (element: Element): element is HTMLStyleElement => {
  return element.tagName === "STYLE";
};
