export type Last<T, R = undefined> = T extends [...Array<unknown>, infer D]
  ? D
  : T extends Array<infer S>
  ? S | undefined
  : R;
