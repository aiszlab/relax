/**
 * @description
 * exclude any value from array
 *
 * for performance, avoid using `Array.includes`, replace with `Set`
 *
 * @example
 * exclude([1, 2, 3, 4, 5], [2, 4]) // [1, 3, 5]
 */
export const exclude = <T, E = unknown>(value: Array<T>, _excludeBy: Array<E>): Array<Exclude<T, E>> => {
  const excludeBy = new Set(_excludeBy)
  // @ts-ignore
  return value.filter((item) => !excludeBy.has(item))
}
