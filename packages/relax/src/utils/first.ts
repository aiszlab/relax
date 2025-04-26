import { type Voidable, type First } from "@aiszlab/relax/types";
import { at } from "./at";
import { isVoid } from "../is/is-void";

/**
 * @description
 * first element
 */
function first(value: undefined | null): undefined;
function first(value: string): string;
function first<T extends Array<unknown>>(value: T): First<T> | undefined;
function first<T extends Array<unknown>>(value: Voidable<string | T>) {
  if (isVoid(value)) {
    return void 0;
  }

  // @ts-expect-error `at` support types
  return at(value, 0);
}

export { first };
