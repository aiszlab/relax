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

const toClassNames = (_classNames: ClassNames): string[] => {
  if (isVoid(_classNames) || isBoolean(_classNames)) return [];

  if (isString(_classNames) || isNumber(_classNames)) return [_classNames.toString()];

  if (isArray(_classNames)) {
    return _classNames.reduce<string[]>((classNames, item) => {
      return classNames.concat(toClassNames(item));
    }, []);
  }

  return Object.entries(_classNames).reduce<string[]>((classNames, [className, isValid]) => {
    if (isValid) {
      classNames.push(className);
    }
    return classNames;
  }, []);
};

export const clsx = (..._classNames: ClassNames[]): string => toClassNames(_classNames).join(" ");
