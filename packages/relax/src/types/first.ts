export type First<T, R = undefined> = T extends [infer D, ...Array<unknown>] ? D : R;
