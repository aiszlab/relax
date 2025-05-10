import { isKey } from "../is/is-key";
import { isObject } from "../is/is-object";
import { isUndefined } from "../is/is-undefined";
import { isVoid } from "../is/is-void";
import { isIndex } from "./is-index";
import { toKey } from "./to-key";
import { toPaths } from "./to-paths";

/**
 * Updates the value at the specified path of the given object using an updater function.
 * If any part of the path does not exist, it will be created.
 *
 * @template T - The type of the object.
 * @param {T} target - The object to modify.
 * @param {PropertyKey | PropertyKey[]} path - The path of the property to update.
 * @param {(value: unknown) => unknown} updater - The function to produce the updated value.
 * @returns {T} - The modified object.
 */
export function update<T extends object | null | undefined>(
  target: T,
  path: PropertyKey | readonly PropertyKey[],
  updater: (value: unknown) => unknown,
): T {
  if (isVoid(target)) {
    return target;
  }

  const _paths = isKey(path, target)
    ? [path]
    : Array.isArray(path)
    ? path
    : typeof path === "string"
    ? toPaths(path)
    : [path];

  let current: object = target;

  for (let i = 0; i < _paths.length && current != null; i++) {
    const key = toKey(_paths[i]);
    let _newValue: unknown;

    if (i === _paths.length - 1) {
      // @ts-expect-error get value of key
      _newValue = updater(current[key]);
    } else {
      // @ts-expect-error get value of key
      const _value = current[key];

      _newValue = !isUndefined(_value)
        ? _value
        : isObject(_value)
        ? _value
        : isIndex(_paths[i + 1])
        ? []
        : {};
    }

    Object.assign(current, { [key]: _newValue });
    // @ts-expect-error get value of key
    current = current[key];
  }

  return target;
}
