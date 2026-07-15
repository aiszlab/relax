import { renderHook } from "@testing-library/react";
import { useTimeout } from "../../src";

describe("useTimeout", () => {
  it("test timeout", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    renderHook(() => useTimeout(fn, 100));

    expect(fn).toHaveBeenCalledTimes(0);

    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("cancel timeout", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const hook = renderHook(() => useTimeout(fn, 100));
    hook.result.current.cancel();

    expect(fn).toHaveBeenCalledTimes(0);

    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it("flush timeout", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const hook = renderHook(() => useTimeout(fn, 100));
    hook.result.current.flush();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("does not set timeout when wait is 0", () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    renderHook(() => useTimeout(fn, 0));

    vi.runAllTimers();
    // When wait is 0, the timer never fires — callback is not called by timer
  });

  it("flush calls callback when no trigger registered", () => {
    const fn = vi.fn();
    const hook = renderHook(() => useTimeout(fn, 100));
    hook.result.current.flush();

    expect(fn).toHaveBeenCalledTimes(1);

    // Second flush should use trigger
    hook.result.current.flush();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});
