import { clamp } from "../../src";

describe("`clamp` util", () => {
  it("middle value", () => {
    const value = clamp(3, 9, 88);
    expect(value).toBe(9);
  });
});
