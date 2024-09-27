import { isVoid } from "./is-void";
import { isArray } from "./is-array";
import { isObject } from "./is-object";

/**
 * @author murukal
 *
 * @description
 * is empty
 */
export const isEmpty = (value?: Object | unknown[] | string | number | boolean | null) => {
  // null or undefined
  if (isVoid(value)) return true;

  // array
  if (isArray(value)) {
    return value.length === 0;
  }

  // object
  if (isObject(value)) {
    return Object.keys(value).length === 0;
  }

  return !value;
};
