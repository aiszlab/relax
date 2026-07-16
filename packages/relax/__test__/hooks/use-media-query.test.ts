import { renderHook, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useMediaQuery } from "../../src";

// ---------------------------------------------------------------------------
// Mock isDomUsable — we control this per-test to cover the !isDomUsable()
// branches (line 11 and line 23).
// ---------------------------------------------------------------------------
const { isDomUsable: _isDomUsable } = vi.hoisted(() => ({
  isDomUsable: vi.fn(() => true),
}));

vi.mock("../../src/is/is-dom-usable", () => ({
  isDomUsable: _isDomUsable,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Mock matchMedia and return the registered listeners array */
function mockMatchMedia(matches = false) {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];
  globalThis.matchMedia = vi.fn(() => ({
    matches,
    addEventListener: (_type: string, listener: (event: MediaQueryListEvent) => void) => {
      listeners.push(listener);
    },
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
  })) as unknown as typeof globalThis.matchMedia;
  return { listeners };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useMediaQuery", () => {
  beforeEach(() => {
    _isDomUsable.mockReturnValue(true);
  });

  // -------------------------------------------------------------------------
  // SSR / no DOM
  // -------------------------------------------------------------------------

  it("returns empty array when DOM is not usable", () => {
    // Covers line 11: !isDomUsable() → return []
    _isDomUsable.mockReturnValue(false);

    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toEqual([]);
  });

  it("effect returns early when DOM is not usable, matchMedia not called", () => {
    // Covers line 23: !isDomUsable() → return (early return from useEffect)
    _isDomUsable.mockReturnValue(false);

    // Mock matchMedia — should never be called because effect returns early
    const matchMediaSpy = vi.fn();
    globalThis.matchMedia = matchMediaSpy as unknown as typeof globalThis.matchMedia;

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(matchMediaSpy).not.toHaveBeenCalled();

    unmount();
  });

  // -------------------------------------------------------------------------
  // Basic: single query (string) → boolean array
  // -------------------------------------------------------------------------

  it("returns boolean array for a single query string", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toBe(false);
  });

  it("returns true when media query matches", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    expect(result.current).toEqual([true]);
  });

  // -------------------------------------------------------------------------
  // Basic: array of queries → boolean array
  // -------------------------------------------------------------------------

  it("handles array of queries", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 768px)", "(max-width: 1024px)"]),
    );

    expect(result.current).toHaveLength(2);
    expect(result.current).toEqual([false, false]);
  });

  // -------------------------------------------------------------------------
  // Change event — value updates when media query status changes
  // -------------------------------------------------------------------------

  it("updates value on media query change event", () => {
    const { listeners } = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    // Initially false
    expect(result.current[0]).toBe(false);

    // Dispatch a change event — covers changeIsMatched (line 15-17)
    act(() => {
      listeners[0]({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current[0]).toBe(true);
  });

  it("updates correct index when multiple queries change", () => {
    const { listeners } = mockMatchMedia(false);
    const { result } = renderHook(() =>
      useMediaQuery(["(min-width: 768px)", "(max-width: 1024px)"]),
    );

    expect(result.current).toEqual([false, false]);

    // Change second query only — covers replaceAt used in changeIsMatched
    act(() => {
      listeners[1]({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toEqual([false, true]);
  });

  // -------------------------------------------------------------------------
  // Cleanup on unmount — removeEventListener is called
  // -------------------------------------------------------------------------

  it("removes event listeners on unmount", () => {
    const removeEventListener = vi.fn();
    globalThis.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })) as unknown as typeof globalThis.matchMedia;

    const { unmount } = renderHook(() => useMediaQuery("(min-width: 768px)"));

    // Unmount triggers useEffect cleanup (line 36-40)
    unmount();

    // removeEventListener should have been called for each query
    expect(removeEventListener).toHaveBeenCalled();
  });

  // -------------------------------------------------------------------------
  // Query change — effect re-runs with new queries
  // -------------------------------------------------------------------------

  it("re-runs effect when queries change, cleaning up old listeners", () => {
    const removeEventListener = vi.fn();
    globalThis.matchMedia = vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    })) as unknown as typeof globalThis.matchMedia;

    const { rerender } = renderHook(
      ({ query }) => useMediaQuery(query),
      { initialProps: { query: "(min-width: 768px)" as string | string[] } },
    );

    // Change queries — old listeners should be cleaned up,
    // new listeners registered for new queries
    rerender({ query: ["(min-width: 768px)", "(min-width: 1024px)"] });

    // Old listener should have been removed during cleanup
    expect(removeEventListener).toHaveBeenCalled();
  });
});
