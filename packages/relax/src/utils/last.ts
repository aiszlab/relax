import { type Voidable, type Last } from "@aiszlab/relax/types";
import { at } from "./at";
import { isVoid } from "../is/is-void";

/**
 * @description
 * last element
 */
function last(value: undefined | null): undefined;
function last(value: string): string;
function last<T extends Array<unknown>>(value: T): Last<T> | undefined;
function last<T extends Array<unknown>>(value: Voidable<string | T>) {
  if (isVoid(value)) {
    return void 0;
  }

  // @ts-expect-error `at` support types
  return at(value, -1);
}

export { last };
