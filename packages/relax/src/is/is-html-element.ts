import type { Voidable } from "../types";

/**
 * @description
 * is html element
 */
export const isHTMLElement = (value: Voidable<EventTarget>): value is HTMLElement => {
  if (!value) return false;
  // @ts-ignore
  return value.nodeType === 1;
};
