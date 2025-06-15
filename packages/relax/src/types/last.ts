export type Last<T> = T extends null | undefined
  ? undefined
  : T extends string
  ? string
  : T extends [...Array<unknown>, infer D]
  ? D
  : T extends Array<infer I>
  ? I | undefined
  : T;
