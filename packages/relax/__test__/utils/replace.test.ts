import { describe, expect, it } from "@jest/globals";
import { replace } from "../../src";

describe("`replace` util", () => {
  it("repalce string", () => {
    const value = replace("hello world", "hello", "hi");
    expect(value).toBe("hi world");
  });

  it("repalce array", () => {
    const value = replace([1, 2, 3, 4, 5, 6, 7, 8], [9, 9, 9], 3);
    expect(value).toEqual([1, 2, 3, 9, 9, 9, 7, 8]);
  });

  it("repalce array, with end index", () => {
    const value = replace([1, 2, 3, 4, 5, 6, 7, 8], [9, 9, 9], 3, 5);
    expect(value).toEqual([1, 2, 3, 9, 9, 9, 6, 7, 8]);
  });

  it("repalce single value", () => {
    const value = replace([1, 2, 3, 4, 5, 6, 7, 8], 9, 3);
    expect(value).toEqual([1, 2, 3, 9, 5, 6, 7, 8]);
  });

  it("repalce single value, with end index", () => {
    const value = replace([1, 2, 3, 4, 5, 6, 7, 8], 9, 3, 5);
    expect(value).toEqual([1, 2, 3, 9, 6, 7, 8]);
  });
});
