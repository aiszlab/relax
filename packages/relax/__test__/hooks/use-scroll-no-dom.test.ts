import { vi } from "vitest";

vi.mock("../../src/is/is-dom-usable", () => ({
  isDomUsable: () => false,
}));

import { renderHook } from "@testing-library/react";
import { useScroll } from "../../src/hooks/use-scroll";

describe("useScroll (no DOM)", () => {
  it("returns cleanup without attaching listener when DOM is not usable", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useScroll(callback));
    const cleanup = result.current;

    expect(typeof cleanup).toBe("function");
  });
});
