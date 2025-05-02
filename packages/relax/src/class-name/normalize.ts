import { isString } from "../is/is-string";
import type { Partialable } from "../types";

function normalize(...classNames: Partialable<string>[]) {
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
