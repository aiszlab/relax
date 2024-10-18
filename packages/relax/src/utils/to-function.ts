import { isFunction } from "../is/is-function";
import type { AnyFunction, State } from "../types";

type Functioned<T> = T extends State<infer R>
  ? () => R
  : T extends AnyFunction
  ? T
  : T extends Function
  ? T
  : () => T;

export const toFunction = <T = unknown>(value: T): Functioned<T> => {
  if (isFunction(value)) {
    return value as Functioned<T>;
  }

  return (() => value) as Functioned<T>;
};
