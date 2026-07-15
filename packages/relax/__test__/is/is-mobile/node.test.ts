// @vitest-environment node
import { isMobile } from "../../../src";

describe("`isMobile`", () => {
  it("node environment", () => {
    expect(isMobile()).toBe(false);
  });
});
