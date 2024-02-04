/**
 * Returns an array of numbers, starting at `from` and ending at `to`.
 * @param from number
 * @param to number
 * @returns number[]
 */
export const range = (from: number, to: number) => {
  const length = to - from + 1
  return Array.from({ length }, (_, index) => index + from)
}
