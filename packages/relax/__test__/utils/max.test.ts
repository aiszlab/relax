import { describe, expect, it } from "@jest/globals";
import { max } from "../../src";

describe("`max`", () => {
  it("normal number values", () => {
    expect(max([1, 2, 3])).toBe(3);
  });

  it("pipe", () => {
    expect(max([1, 2, 3], (value) => value * 2)).toBe(3);
  });

  it("pipe object", () => {
    expect(max([{ value: 1 }, { value: 2 }, { value: 3 }], (value) => value.value)).toEqual({
      value: 3,
    });
  });

  it("duplicate values, should return the first", () => {
    const first = { value: 1 };
    const second = { value: 2 };
    const third = { value: 3 };
    const fourth = { value: 3 };

    expect(max([first, second, third, fourth], (value) => value.value)).toBe(third);
  });
});
