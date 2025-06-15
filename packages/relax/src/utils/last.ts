import { type Voidable, type Last } from "@aiszlab/relax/types";
import { at } from "./at";
import { isVoid } from "../is/is-void";

/**
 * @description
 * last element
 */
function last<T extends Array<unknown>>(value: Voidable<string | T>): Last<T> {
  if (isVoid(value)) {
    return void 0 as Last<T>;
  }

  return at(value, -1);
}

export { last };
