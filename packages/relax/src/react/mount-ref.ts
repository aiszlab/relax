import type { MutableRefObject, RefCallback } from "react";
import { isFunction } from "../../src/is/is-function";
import { Voidable } from "../types";
import { isVoid } from "../is/is-void";

export type Refable<T> = RefCallback<T> | MutableRefObject<T> | string;

export const mountRef = <T>(refable: Voidable<Refable<T>>, reference: T) => {
  if (isVoid(refable)) {
    return;
  }

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
