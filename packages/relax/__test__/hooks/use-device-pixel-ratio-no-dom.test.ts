/**
 * This test needs to mock isDomUsable BEFORE import, so it runs in a separate file.
 */
import { vi } from "vitest";

// Mock before any imports
vi.mock("../../src/is/is-dom-usable", () => ({
  isDomUsable: () => false,
}));

import { renderHook } from "@testing-library/react";
import { useDevicePixelRatio } from "../../src/hooks/use-device-pixel-ratio";

describe("useDevicePixelRatio (no DOM)", () => {
  it("returns 1 when DOM is not usable", () => {
    const { result } = renderHook(() => useDevicePixelRatio());
    expect(result.current).toBe(1);
  });
});
