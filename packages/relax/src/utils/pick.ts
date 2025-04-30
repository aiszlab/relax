import { get } from "./get";
import { set } from "./set";

/**
 * pick value
 */
function pick<T extends object>(value: T, keys: PropertyKey[]) {
  return keys.reduce<Partial<T>>((picked, key) => {
    set(picked, key, get(value, key));
    return picked;
  }, {});
}

export { pick };
