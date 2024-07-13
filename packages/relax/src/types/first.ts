export type First<T> = T extends [infer D, ...Array<unknown>] ? D : undefined;
