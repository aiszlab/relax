import { describe, expect, it } from "@jest/globals";
import { last } from "../../src";

describe("`last` util", () => {
  it("should return first element of array", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  it("should return first element of string", () => {
    expect(last("abc")).toBe("c");
  });

  it("should return undefined of null", () => {
    expect(last(null)).toBe(undefined);
  });
});
