// @vitest-environment node
import { isDomUsable } from "../../../src";

describe("`isDomUsable`", () => {
  it("should return false when window is invalid", () => {
    expect(isDomUsable()).toBe(false);
  });
});
