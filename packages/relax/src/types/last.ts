export type Last<T> = T extends [...Array<unknown>, infer D] ? D : undefined
