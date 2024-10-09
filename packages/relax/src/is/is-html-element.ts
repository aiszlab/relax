/**
 * @description
 * is html element
 */
export const isHTMLElement = (value: unknown): value is HTMLElement => {
  if (!value) return false;
  return (value as Element).nodeType === 1;
};
