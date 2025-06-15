import { type Voidable, type First } from "@aiszlab/relax/types";
import { at } from "./at";
import { isVoid } from "../is/is-void";

/**
 * @description
 * first element
 */
function first<T extends Array<unknown>>(value: Voidable<string | T>): First<T> {
  if (isVoid(value)) {
    return void 0 as First<T>;
  }

  return at(value, 0);
}

export { first };
