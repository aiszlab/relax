/**
 * 获取数据元素的类型
 */
type ValueOfArray<T extends readonly unknown[]> = T extends readonly (infer V)[] ? V : never;

/**
 * 获取对象的值类型
 */
type ValueOfObject<T extends Record<string, unknown>> = T extends Record<string, infer V>
  ? V
  : never;

/**
 * 获取`Set`的值类型
 */
type ValueOfSet<T extends Set<unknown>> = T extends Set<infer V> ? V : never;

/**
 * 获取`Map`的值类型
 */
type ValueOfMap<T extends Map<unknown, unknown>> = T extends Map<unknown, infer V> ? V : never;

/**
 * 统一获取值的类型方法
 */
export type ValueOf<T> = T extends readonly unknown[]
  ? ValueOfArray<T>
  : T extends Record<string, unknown>
  ? ValueOfObject<T>
  : T extends Set<unknown>
  ? ValueOfSet<T>
  : T extends Map<unknown, unknown>
  ? ValueOfMap<T>
  : never;
