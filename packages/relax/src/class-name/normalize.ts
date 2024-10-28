import { isString } from "../is/is-string";

function normalize(...classNames: string[]) {
  const values = new Set<string>();

  for (const _classNames of classNames) {
    if (!isString(_classNames)) return;

    for (const [className] of _classNames.matchAll(/\S+/g)) {
      values.add(className);
    }
  }

  return Array.from(values);
}

export { normalize };
