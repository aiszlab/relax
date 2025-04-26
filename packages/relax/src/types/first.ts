export type First<T> = T extends null | undefined
  ? undefined
  : T extends string
  ? string
  : T extends [infer D, ...Array<any>]
  ? D
  : T extends Array<infer S>
  ? S | undefined
  : T;
