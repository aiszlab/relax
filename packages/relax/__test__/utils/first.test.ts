import { describe, expect, it } from "@jest/globals";
import { first } from "../../src";

describe("`first` util", () => {
  it("should return first element of array", () => {
    expect(first([1, 2, 3])).toBe(1);
  });

  it("should return first element of string", () => {
    expect(first("abc")).toBe("a");
  });

  it("should return undefined of null", () => {
    expect(first(null)).toBe(undefined);
  });
});
