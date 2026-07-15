import { isString } from "../is/is-string";
import type { Voidable } from "../types";

function normalize(...classNames: Voidable<string>[]) {
  const values = new Set<string>();

  for (const _classNames of classNames) {
    if (!isString(_classNames)) continue;

    for (const { 0: className } of _classNames.matchAll(/\S+/g)) {
      values.add(className);
    }
  }

  return Array.from(values);
}

export { normalize };
