export type Arguments<T extends Function> = T extends (...args: infer A) => unknown ? A : never
