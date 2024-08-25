import type { Voidable } from "../types";
import { isHTMLElement, type Node } from "./is-html-element";

/**
 * @param value - The element being tested
 * @returns Returns true if x is an HTML input tag, false otherwise
 */
export const isHTMLInputElement = (value: Voidable<Node>): value is HTMLInputElement => {
  return isHTMLElement(value) && value.tagName === "INPUT";
};
