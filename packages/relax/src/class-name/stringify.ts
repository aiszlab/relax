import { isArray } from "../is/is-array";
import { isBoolean } from "../is/is-boolean";
import { isNumber } from "../is/is-number";
import { isString } from "../is/is-string";
import { isVoid } from "../is/is-void";

type ClassNames =
  | string
  | number
  | Record<string, boolean>
  | ClassNames[]
  | null
  | undefined
  | boolean;

const toClassNames = (_classNames: ClassNames): Set<string> => {
  if (isVoid(_classNames) || isBoolean(_classNames)) return new Set();

  if (isString(_classNames) || isNumber(_classNames)) return new Set([_classNames.toString()]);

  if (isArray(_classNames)) {
    return _classNames.reduce<Set<string>>((classNames, item) => {
      return classNames.union(toClassNames(item));
    }, new Set());
  }

  return Object.entries(_classNames).reduce<Set<string>>((classNames, [className, isValid]) => {
    if (isValid) {
      classNames.add(className);
    }
    return classNames;
  }, new Set());
};

export const stringify = (..._classNames: ClassNames[]): string =>
  Array.from(toClassNames(_classNames)).join(" ");
