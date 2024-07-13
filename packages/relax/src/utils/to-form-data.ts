import { isArray } from "../is/is-array";
import type { Voidable } from "../types";

/**
 * @description
 * convert to formData
 */
export const toFormData = (data: unknown) => {
  return Object.entries(data ?? {}).reduce((prev, [key, value]) => {
    // support key-value array data
    // if value is { list: [ 11, 22 ] }
    // like prev.append('list[]', 11);
    if (isArray(value)) {
      value.forEach((item) => {
        prev.append(`${key}[]`, item as string | Blob);
      });
      return prev;
    }

    prev.append(key, value as string | Blob);
    return prev;
  }, new FormData());
};
