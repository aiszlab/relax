import { isString } from "../is/is-string";
import { isUndefined } from "../is/is-undefined";

type Splitter = string | RegExp;

/**
 * @description
 * convert any type data to a array
 */
function toArray(value: string, splitter?: Splitter): string[];
function toArray<T = unknown>(value: T): T extends Array<unknown> ? T : T[];
function toArray<T extends unknown = unknown>(value: T | Array<T>, splitter?: Splitter) {
  // string branch
  if (isString(value)) {
    if (isUndefined(splitter)) {
      return [value];
    }

    return value.split(splitter);
  }

  // array branch
  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

export { toArray };
