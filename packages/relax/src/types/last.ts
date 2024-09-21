export type Last<T, R = undefined> = T extends [...Array<unknown>, infer D] ? D : R;
