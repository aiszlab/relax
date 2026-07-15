import { vi } from "vitest";

vi.mock("../../src/is/is-dom-usable", () => ({
  isDomUsable: () => false,
}));

import { renderHook } from "@testing-library/react";
import { useScreenSize } from "../../src/hooks/use-screen-size";

describe("useScreenSize (no DOM)", () => {
  it("returns zero size when DOM is not usable", () => {
    const { result } = renderHook(() => useScreenSize());
    expect(result.current).toEqual({ width: 0, height: 0 });
  });
});
