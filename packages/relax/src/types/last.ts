export type Last<T> = T extends null | undefined
  ? undefined
  : T extends [...Array<unknown>, infer D]
  ? D
  : T extends Array<infer S>
  ? S | undefined
  : T;
