import type { MutableRefObject, RefCallback } from "react";
import { isFunction } from "../is/is-function";

export type Refable<T> = RefCallback<T> | MutableRefObject<T> | string;

export const mountRef = <T>(refable: Refable<T>, reference: T) => {
  if (isFunction(refable)) {
    refable(reference);
    return;
  }

  // in deprecated react, class component can use string ref
  // but there are many problems, in relax, we just make it not work
  // issue for react: https://github.com/facebook/react/pull/8333#issuecomment-271648615
  if (typeof refable === "string") {
    return;
  }

  refable.current = reference;
};
