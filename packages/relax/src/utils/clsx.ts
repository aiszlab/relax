import { isArray } from "../is/is-array";
import { isNumber } from "../is/is-number";
import { isString } from "../is/is-string";
import { isVoid } from "../is/is-void";

type Value = string | number | Record<string, boolean> | Value[] | null | undefined;

const toClassNames = (value: Value): string[] => {
  if (isVoid(value)) return [];

  if (isString(value) || isNumber(value)) return [value.toString()];

  if (isArray(value)) {
    return value.reduce<string[]>((classNames, item) => {
      return classNames.concat(toClassNames(item));
    }, []);
  }

  return Object.entries(value).reduce<string[]>((classNames, [className, isValid]) => {
    if (isValid) {
      classNames.push(className);
    }
    return classNames;
  }, []);
};

export const clsx = (...args: Value[]): string => toClassNames(args).join(" ");
