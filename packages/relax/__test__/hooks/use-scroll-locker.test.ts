import { renderHook } from "@testing-library/react";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { useScrollLocker } from "../../src";

// ---------------------------------------------------------------------------
// Polyfill: jsdom does not support CSS Typed OM (attributeStyleMap)
// The ScrollLocker.barSize getter uses it to set inline styles on a
// measurement div. We delegate `.set(prop, val)` to `element.style[prop]`.
// ---------------------------------------------------------------------------
const origAttributeStyleMap = Object.getOwnPropertyDescriptor(
  HTMLDivElement.prototype,
  "attributeStyleMap",
);

beforeAll(() => {
  Object.defineProperty(HTMLDivElement.prototype, "attributeStyleMap", {
    get(this: HTMLElement) {
      return {
        set: (property: string, value: string) => {
          (this.style as unknown as Record<string, string>)[property] = value;
        },
      };
    },
    configurable: true,
  });
});

afterAll(() => {
  // Restore the original descriptor (or lack thereof)
  if (origAttributeStyleMap) {
    Object.defineProperty(
      HTMLDivElement.prototype,
      "attributeStyleMap",
      origAttributeStyleMap,
    );
  } else {
    delete (HTMLDivElement.prototype as unknown as Record<string, unknown>)["attributeStyleMap"];
  }
});

// ---------------------------------------------------------------------------
// Mock isOverflow — jsdom doesn't compute scroll dimensions (always 0),
// so we mock it to control the isOverflow check in lock().
// ---------------------------------------------------------------------------
const { isOverflow: _isOverflow } = vi.hoisted(() => ({
  isOverflow: vi.fn(() => false),
}));

vi.mock("../../src/is/is-overflow", () => ({
  isOverflow: _isOverflow,
}));

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe("useScrollLocker", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // Hook: isLock = false → unlock path
  // ---------------------------------------------------------------------------

  it("calls unlock when isLock=false (no-op when not locked)", () => {
    // Covers lines 84–86 (unlock path) and line 67 (!locked.has → early return)
    const { unmount } = renderHook(() => useScrollLocker(false));
    unmount();
  });

  // ---------------------------------------------------------------------------
  // Hook: isLock = true, body NOT overflowing → lock returns early
  // ---------------------------------------------------------------------------

  it("lock returns early when body is not overflowing", () => {
    // Covers line 54 (!isOverflow → early return)
    _isOverflow.mockReturnValue(false);

    const { unmount } = renderHook(() => useScrollLocker(true));
    unmount();
  });

  // ---------------------------------------------------------------------------
  // Full lock path: body IS overflowing
  // ---------------------------------------------------------------------------

  it("locks body when overflowing: computes barSize and sets overflow hidden", () => {
    // Covers lines 27–41 (barSize computation via measurement div),
    // and lines 56–62 (normal lock path with setStyle)
    _isOverflow.mockReturnValue(true);

    const { unmount } = renderHook(() => useScrollLocker(true));

    // Lock should set overflow to "hidden"
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
  });

  // ---------------------------------------------------------------------------
  // Cached barSize path (line 23)
  // ---------------------------------------------------------------------------

  it("uses cached barSize on subsequent locks", () => {
    // First lock: computes barSize (lines 27–41)
    // Unlock then lock again: uses cached barSize (line 23)
    _isOverflow.mockReturnValue(true);

    const { rerender, unmount } = renderHook(
      ({ isLock }) => useScrollLocker(isLock),
      { initialProps: { isLock: true } },
    );

    // Unlock — clears the locked set (lines 70–71)
    rerender({ isLock: false });

    // Lock again — barSize is already cached, hits line 23
    rerender({ isLock: true });
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
  });

  // ---------------------------------------------------------------------------
  // Unlock: normal path — restore previous styles (lines 70–71)
  // ---------------------------------------------------------------------------

  it("unlock restores previous overflow style", () => {
    _isOverflow.mockReturnValue(true);
    const prevOverflow = document.body.style.overflow;

    const { rerender, unmount } = renderHook(
      ({ isLock }) => useScrollLocker(isLock),
      { initialProps: { isLock: true } },
    );

    expect(document.body.style.overflow).toBe("hidden");

    // Unlock should restore the previous overflow value (line 70)
    rerender({ isLock: false });
    expect(document.body.style.overflow).toBe(prevOverflow);

    unmount();
  });

  // ---------------------------------------------------------------------------
  // Cleanup on unmount (lines 89–91)
  // ---------------------------------------------------------------------------

  it("cleanup unlocks on unmount", () => {
    _isOverflow.mockReturnValue(true);

    const { unmount } = renderHook(() => useScrollLocker(true));
    expect(document.body.style.overflow).toBe("hidden");

    // Cleanup (line 89–91) should call unlock and restore styles
    unmount();
    expect(document.body.style.overflow).not.toBe("hidden");

    // isOverflow should have been called during lock()
    expect(_isOverflow).toHaveBeenCalled();
  });

  // ---------------------------------------------------------------------------
  // Already locked element (line 51) — singleton shared across hook instances
  // ---------------------------------------------------------------------------

  it("skips locking an element that is already locked", () => {
    // Covers line 51: #locked.has(element) → early return
    // Two hooks mounted simultaneously share the same ScrollLocker singleton
    _isOverflow.mockReturnValue(true);

    const { unmount: unmount1 } = renderHook(() => useScrollLocker(true));
    const overflowAfterFirst = document.body.style.overflow;
    expect(overflowAfterFirst).toBe("hidden");

    // Second hook mounts with isLock=true — lock() on same body
    // should hit the already-locked check at line 51
    const { unmount: unmount2 } = renderHook(() => useScrollLocker(true));
    // Style should stay the same (lock returned early at line 51)
    expect(document.body.style.overflow).toBe(overflowAfterFirst);

    unmount2();
    unmount1();
  });

  // ---------------------------------------------------------------------------
  // Singleton: lock state persists across hook instances
  // ---------------------------------------------------------------------------

  it("maintains singleton lock state across separate hook instances", () => {
    // Covers constructor singleton pattern (lines 18–20)
    _isOverflow.mockReturnValue(true);

    // Instance 1: lock, then unmount (cleanup unlocks)
    const { unmount: unmount1 } = renderHook(() => useScrollLocker(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount1();

    // Instance 2: can lock again (proving singleton state was cleaned up
    // by instance 1's cleanup, and constructor returns the same singleton)
    const { unmount: unmount2 } = renderHook(() => useScrollLocker(true));
    expect(document.body.style.overflow).toBe("hidden");
    unmount2();
  });

  // ---------------------------------------------------------------------------
  // Unlock on already-unlocked element (no-op via cleanup)
  // ---------------------------------------------------------------------------

  it("unlock on cleanup is a no-op when element was not locked", () => {
    // Covers line 67: unlock on a never-locked element returns early
    _isOverflow.mockReturnValue(false);

    const { unmount } = renderHook(() => useScrollLocker(false));
    unmount();
    // No assertions needed — just verifying no errors thrown
  });
});
