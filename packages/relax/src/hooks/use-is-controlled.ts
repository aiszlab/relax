import { useMemo } from "react";
import { isUndefined } from "../is/is-undefined";

/**
 * @description
 * check any value is controlled
 * juse check `value` === `void 0`
 */
const useIsControlled = (value: unknown) => {
  return useMemo(() => isUndefined(value), [value]);
};

export { useIsControlled };
