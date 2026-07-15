import { toArray } from "../../src";

describe("`toArray` util", () => {
  it("already array value", () => {
    expect(toArray([0])).toStrictEqual([0]);
  });

  it("not array value", () => {
    expect(toArray("className style key")).toStrictEqual(["className style key"]);
    expect(toArray("")).toStrictEqual([""]);
  });

  it("return empty array for null", () => {
    expect(toArray(null)).toEqual([]);
  });

  it("return empty array for undefined", () => {
    expect(toArray(undefined)).toEqual([]);
  });

  it("return same array for array input", () => {
    const arr = [1, 2, 3];
    expect(toArray(arr)).toBe(arr);
  });

  it("convert iterable (Set) to array", () => {
    const set = new Set([1, 2, 3]);
    expect(toArray(set)).toEqual([1, 2, 3]);
  });

  it("wrap non-iterable value in array", () => {
    expect(toArray(42)).toEqual([42]);
    expect(toArray(true)).toEqual([true]);
    expect(toArray({ a: 1 })).toEqual([{ a: 1 }]);
  });
});
