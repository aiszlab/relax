/**
 * @description
 * exclude any value from array
 *
 * for performance, avoid using `Array.includes`, replace with `Set`
 */
export const exclude = (value: Array<unknown>, _excludeBy: Array<unknown>) => {
  const excludeBy = new Set(_excludeBy)
  return value.filter((item) => !excludeBy.has(item))
}
