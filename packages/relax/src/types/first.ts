export type First<T, R = undefined> = T extends string
  ? string
  : T extends [infer D, ...Array<unknown>]
  ? D
  : T extends Array<infer S>
  ? S | undefined
  : R;
