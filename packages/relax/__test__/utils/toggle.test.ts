import { toggle } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`toggle` util", () => {
  it("add value into array", () => {
    const value = toggle([1, 2, 3], 4);
    expect(value).toStrictEqual([1, 2, 3, 4]);
  });

  it("remove value from array", () => {
    const value = toggle([1, 2, 3, 4], 4);
    expect(value).toStrictEqual([1, 2, 3]);
  });

  it("add value into set", () => {
    const value = toggle(new Set([1, 2, 3]), 4);
    expect(value).toStrictEqual(new Set([1, 2, 3, 4]));
  });

  it("remove value from set", () => {
    const value = toggle(new Set([1, 2, 3, 4]), 4);
    expect(value).toStrictEqual(new Set([1, 2, 3]));
  });
});
