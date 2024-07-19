import { isArray } from "../is/is-array";

type ReplaceArrayOptions<R> = {
  index: number;
  replaceValue: R;
};

type ReplaceStringOptions = {
  searchValue: string;
  replaceValue: string;
};

type ReplaceOptions<T> = T extends string
  ? ReplaceStringOptions
  : T extends Array<infer R>
  ? ReplaceArrayOptions<R>
  : never;

/**
 * @description
 * comman replace
 * usable for `string`, `array`
 */
export const replace = <T extends string | R[], R>(value: T, options: ReplaceOptions<T>): T => {
  if (isArray(value as unknown)) {
    const { index, replaceValue } = options as ReplaceArrayOptions<R>;
    return [...value.slice(0, index), replaceValue, ...value.slice(index + 1)] as T;
  }

  const { replaceValue, searchValue } = options as ReplaceStringOptions;
  return (value as string).replace(searchValue, replaceValue) as T;
};
