import { isDomUsable } from "../../../src";
import { describe, expect, it } from "@jest/globals";

describe("`isDomUsable`", () => {
  it("should return false when window is invalid", () => {
    expect(isDomUsable()).toBe(false);
  });
});
