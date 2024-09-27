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
});
