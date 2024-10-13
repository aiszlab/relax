import { isFunction } from "../is/is-function";
import type { AnyFunction } from "../types";

type Functionable<T> = T extends AnyFunction ? T : T extends Function ? T : () => T;

export const toFunction = <T>(value: unknown) => {
  if (isFunction(value)) {
    return value as Functionable<T>;
  }

  return (() => value) as unknown as Functionable<T>;
};
