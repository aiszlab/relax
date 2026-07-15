import { renderHook } from "@testing-library/react";
import { useDevicePixelRatio } from "../../src";
import { vi } from "vitest";

describe("useDevicePixelRatio", () => {
  it("returns a number", () => {
    const { result } = renderHook(() => useDevicePixelRatio());
    expect(typeof result.current).toBe("number");
  });

  it("returns device pixel ratio", () => {
    const { result } = renderHook(() => useDevicePixelRatio());
    expect(result.current).toBe(window.devicePixelRatio);
  });
});

describe("useDevicePixelRatio (DOM not usable)", () => {
  it("returns 1 when DOM is not usable", async () => {
    vi.doMock("../../src/is/is-dom-usable", () => ({
      isDomUsable: vi.fn(() => false),
    }));

    const { useDevicePixelRatio: useDPR } = await import(
      "../../src/hooks/use-device-pixel-ratio"
    );
    const { result } = renderHook(() => useDPR());
    expect(result.current).toBe(1);

    vi.restoreAllMocks();
  });
});
