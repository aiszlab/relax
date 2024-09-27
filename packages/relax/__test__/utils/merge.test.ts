import { merge } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`merge` util", () => {
  it("merge always return a new object", () => {
    const value = { a: 1 };
    const merged = merge(value);
    expect(value).not.toBe(merged);
    expect(value).toEqual(merged);
  });

  it("should merge two objects", () => {
    const result = merge({ a: 1 }, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("should merge multiple objects", () => {
    const result = merge({ a: 1 }, { b: 2 }, { c: 3 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it("should merge nested objects", () => {
    const result = merge({ a: { b: 1 } }, { a: { c: 2 } });
    expect(result).toEqual({ a: { b: 1, c: 2 } });
  });

  it("should merge arrays", () => {
    const result = merge([1, 2], [3, 4]);
    expect(result).toEqual([3, 4]);
  });

  it("should return array when merge array with object", () => {
    const result = merge([1, 2], { 0: "test", "1": 10, 2: true });
    expect(result).toEqual(["test", 10]);
  });

  it("skip null or undefined values", () => {
    const result = merge({ a: 1 }, null, { b: 2 }, undefined);
    expect(result).toEqual({ a: 1, b: 2 });
  });
});
