export type First<T> = T extends null | undefined
  ? undefined
  : T extends string
  ? string
  : T extends [infer D, ...Array<any>]
  ? D
  : T extends ReadonlyArray<infer I>
  ? I | undefined
  : T;
