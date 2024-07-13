import { isFunction } from "../is/is-function";

export const toFunction = <T extends Function>(value: unknown): T => {
  const _isFunction = isFunction(value);

  if (_isFunction) {
    return value as T;
  }

  return (() => value) as unknown as T;
};
