import { isMobile } from "../../../src";
import { describe, expect, it } from "@jest/globals";

describe("`isMobile`", () => {
  it("node environment", () => {
    expect(isMobile()).toBe(false);
  });
});
