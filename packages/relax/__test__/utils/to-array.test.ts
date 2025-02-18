import { toArray } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("`toArray` util", () => {
  it("already array value", () => {
    expect(toArray([0])).toStrictEqual([0]);
  });

  it("separator usage", () => {
    expect(toArray("className style key")).toStrictEqual(["className style key"]);
    expect(toArray("className style key", " ")).toStrictEqual(["className", "style", "key"]);

    expect(toArray("", "")).toStrictEqual([]);
    expect(toArray("className", "")).toStrictEqual(["c", "l", "a", "s", "s", "N", "a", "m", "e"]);
  });
});
