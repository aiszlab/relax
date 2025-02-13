import { type ReactElement, type ReactNode, isValidElement } from "react";
import { isMemo, isFragment } from "react-is";
import type { Refable } from "../react/mount-ref";
import type { Nullable } from "../types";

/**
 * @description
 */
export const isRefable = <T>(
  node: ReactNode,
): node is ReactElement & { ref: Nullable<Refable<T>> } => {
  if (!isValidElement(node)) {
    return false;
  }

  if (isFragment(node)) {
    return false;
  }

  return isElementRefable(node);
};

/**
 * @description
 * check element refable
 */
const isElementRefable = (element: any) => {
  const type = isMemo(element) ? element.type.type : element.type;

  // Function component node
  if (typeof type === "function" && !type.prototype?.render) {
    return false;
  }

  // Class component
  if (typeof element === "function" && !element.prototype?.render) {
    return false;
  }

  return true;
};
