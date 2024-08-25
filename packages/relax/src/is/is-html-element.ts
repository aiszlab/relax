import type { Voidable } from "../types";

export type Node = {
  nodeType?: number;
};

/**
 * @description
 * is html element
 */
export const isHTMLElement = (value: Voidable<Node>): value is HTMLElement => {
  if (!value) return false;
  return value.nodeType === 1;
};
