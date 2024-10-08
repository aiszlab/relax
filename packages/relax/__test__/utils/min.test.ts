import { describe, expect, it } from "@jest/globals";
import { min } from "../../src";

describe("`min`", () => {
  it("normal number values", () => {
    expect(min([1, 2, 3])).toBe(1);
  });

  it("pipe", () => {
    expect(min([1, 2, 3], (value) => value * 2)).toBe(1);
  });

  it("pipe object", () => {
    expect(min([{ value: 1 }, { value: 2 }, { value: 3 }], (value) => value.value)).toEqual({
      value: 1,
    });
  });

  it("duplicate values, should return the first", () => {
    const first = { value: 1 };
    const second = { value: 2 };
    const third = { value: 3 };
    const fourth = { value: 1 };

    expect(min([first, second, third, fourth], (value) => value.value)).toBe(first);
  });
});
