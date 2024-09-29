import type { Nullable, Voidable } from "@aiszlab/relax/types";
import { mountRef, type Refable } from "../react/mount-ref";
import { useEvent } from "./use-event";

export const useRefs = <T>(...refs: Voidable<Refable<Nullable<T>>>[]) => {
  return useEvent((reference: T) => {
    refs.forEach((ref) => {
      if (!ref) return;
      mountRef(ref, reference);
    });
  });
};
