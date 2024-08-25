import type { Voidable } from "../types";
import { isHTMLElement } from "./is-html-element";

/**
 * @param value - The element being tested
 * @returns Returns true if x is an HTML input tag, false otherwise
 */
export const isHTMLInputElement = (value: Voidable<EventTarget>): value is HTMLInputElement => {
  return isHTMLElement(value) && value.tagName === "INPUT";
};
