import { describe, expect, it } from "@jest/globals";
import { replace } from "../../src";

describe("`replace` util", () => {
  it("repalce string", () => {
    const value = replace("hello world", "hello", "hi");
    expect(value).toBe("hi world");
  });

  it("repalce array", () => {
    const value = replace([1, 2, 3, 4, 5, 6, 7, 8], 3, 10);
    expect(value).toEqual([1, 2, 10, 4, 5, 6, 7, 8]);
  });
});
