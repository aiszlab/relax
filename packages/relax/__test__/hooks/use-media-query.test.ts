import { renderHook, act } from "@testing-library/react";
import { useMediaQuery } from "../../src";

function mockMatchMedia() {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];
  globalThis.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    },
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })) as unknown as typeof globalThis.matchMedia;
  return { listeners };
}

describe("useMediaQuery", () => {
  it("returns array of match results", () => {
    mockMatchMedia();
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(Array.isArray(result.current)).toBe(true);
    result.current.forEach((matched: unknown) => {
      expect(typeof matched).toBe("boolean");
    });
  });

  it("handles array of queries", () => {
    mockMatchMedia();
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 768px)", "(max-width: 1024px)"]),
    );

    expect(result.current).toHaveLength(2);
    result.current.forEach((matched: unknown) => {
      expect(typeof matched).toBe("boolean");
    });
  });

  it("handles change event", () => {
    const { listeners } = mockMatchMedia();

    renderHook(() =>
      useMediaQuery(["(min-width: 768px)"]),
    );

    // Dispatch a change event to trigger changeIsMatched
    if (listeners.length > 0) {
      act(() => {
        listeners[0]({ matches: true } as MediaQueryListEvent);
      });
    }
  });
});
