import { vi } from "vitest";

vi.mock("../../src/is/is-dom-usable", () => ({
  isDomUsable: () => false,
}));

import { load } from "../../src/utils/load";

describe("`load` (no DOM)", () => {
  it("returns null when DOM is not usable", () => {
    expect(load("script", "https://example.com/test.js")).toBeNull();
  });
});
