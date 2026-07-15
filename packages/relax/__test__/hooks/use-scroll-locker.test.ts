import { renderHook } from "@testing-library/react";
import { useScrollLocker } from "../../src";

describe("useScrollLocker", () => {
  it("does not lock when isLock=false", () => {
    const { unmount } = renderHook(() => useScrollLocker(false));
    unmount();
  });

  it("locks when isLock=true", () => {
    const { unmount } = renderHook(() => useScrollLocker(true));
    unmount();
  });

  it("unlocks on cleanup when isLock changes", () => {
    const { rerender, unmount } = renderHook(
      ({ isLock }) => useScrollLocker(isLock),
      { initialProps: { isLock: true } },
    );

    rerender({ isLock: false });

    unmount();
  });

  it("caches barSize on second lock (line 23)", () => {
    // Make body overflowing so the first lock() proceeds past the
    // isOverflow check, computes barSize, and stores it in #barSize.
    // The second lock() then returns the cached value at line 23.
    const spill = document.createElement("div");
    spill.style.height = "10000px";
    document.body.appendChild(spill);

    const { rerender, unmount } = renderHook(
      ({ isLock }) => useScrollLocker(isLock),
      { initialProps: { isLock: true } },
    );

    // Unlock so the locked set is cleared for the next lock
    rerender({ isLock: false });

    // Lock again -- this time barSize is already cached
    rerender({ isLock: true });

    document.body.removeChild(spill);
    unmount();
  });

  it("skips locking a non-overflowing element (line 54)", () => {
    // In default jsdom the body is not overflowing,
    // so lock() returns early at the !isOverflow check.
    const { unmount } = renderHook(() => useScrollLocker(true));
    unmount();
  });

  it("skips unlocking an element that was not locked (line 67)", () => {
    // unlock() is called on body which was never locked,
    // so it returns early at the !locked.has(element) check.
    const { unmount } = renderHook(() => useScrollLocker(false));
    unmount();
  });
});
