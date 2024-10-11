/**
 * @description
 * partial some fields
 */
export type PartialIn<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;
