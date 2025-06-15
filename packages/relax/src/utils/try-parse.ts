import { isString } from "../is/is-string";

/**
 * try JSON.parse
 */
export function tryParse(value: unknown) {
  if (!isString(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}
