import { type MutableRefObject, type RefCallback, useMemo } from "react";
import { isFunction } from "../is/is-function";
import type { Nullable, Voidable } from "@aiszlab/relax/types";

type Refable<T> = RefCallback<T> | MutableRefObject<T> | string;

const mount = <T>(ref: Refable<T>, trigger: T) => {
  if (isFunction(ref)) {
    ref(trigger);
    return;
  }

  // in deprecated react, class component can use string ref
  // but there are many problems, in relax, we just make it not work
  // issue for react: https://github.com/facebook/react/pull/8333#issuecomment-271648615
  if (typeof ref === "string") {
    return;
  }

  ref.current = trigger;
};

export const useRefs = <T>(...refs: Voidable<Refable<Nullable<T>>>[]) => {
  return useMemo(() => {
    return (trigger: T) => {
      refs.forEach((ref) => {
        if (!ref) return;
        mount(ref, trigger);
      });
    };
  }, refs);
};
