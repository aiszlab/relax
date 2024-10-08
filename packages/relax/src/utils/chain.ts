import type { Voidable } from "@aiszlab/relax/types";

export const chain = <T extends Function>(...callbacks: Voidable<T>[]): T => {
  return ((...args: unknown[]) => {
    callbacks.forEach((callback) => {
      callback?.(...args);
    });
  }) as unknown as T;
};
