import { isSet } from "../is/is-set";

/**
 * toggle api
 * @description
 * when list has current key, remove it, otherwise add it
 *
 * return  a copy of list
 */
export const toggle = <R, T extends Iterable<R>>(value: T, key: R): T => {
  if (isSet(value)) {
    const copied = new Set(value);

    if (copied.has(key)) {
      copied.delete(key);
    } else {
      copied.add(key);
    }

    return copied as unknown as T;
  }

  const copied = Array.from(value);
  const index = copied.indexOf(key);

  if (index === -1) {
    copied.push(key);
  } else {
    copied.splice(index, 1);
  }

  return copied as unknown as T;
};
