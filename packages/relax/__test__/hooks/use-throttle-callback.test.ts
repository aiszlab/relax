import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useThrottleCallback } from "../../src";

describe("useThrottleCallback", () => {
  // ---------------------------------------------------------------------------
  // Plain function — basic throttle behavior
  // ---------------------------------------------------------------------------

  it("plain function: first next passes through, subsequent calls within window are suppressed", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number, y: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number, y: number) => {
        _cb(x, y);
      }, 32),
    );

    hook.result.current.next(1, 2);
    hook.result.current.next(3, 4);

    vi.runOnlyPendingTimers();

    // Throttle: first call fires, second is suppressed
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(1, 2);
  });

  it("plain function: allows next call after throttle window elapses", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    // First call — fires synchronously (leading edge)
    hook.result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(1);

    // Second call within window — suppressed
    hook.result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(1);

    // After window elapses, new call passes through
    vi.advanceTimersByTime(100);
    hook.result.current.next(3);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith(3);
  });

  // ---------------------------------------------------------------------------
  // Throttler with pipe — transforms args
  // ---------------------------------------------------------------------------

  it("pipe transforms args before callback", () => {
    vi.useFakeTimers();

    const _cb = vi.fn<(args: readonly [number, number]) => void>();

    const hook = renderHook(() =>
      useThrottleCallback(
        {
          callback: _cb,
          pipe: (x: number, y: number) => [x + 1, y + 1] as const,
        },
        32,
      ),
    );

    hook.result.current.next(1, 2);
    hook.result.current.next(3, 4);

    vi.runOnlyPendingTimers();

    // Pipe transformed: (1,2) → [2,3]; throttle keeps first
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith([2, 3]);
  });

  // ---------------------------------------------------------------------------
  // flush — resets the throttle pipe (Waitable.flush covers line 79)
  // ---------------------------------------------------------------------------

  it("flush resets throttle state so next call passes immediately", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    // First call fires synchronously
    hook.result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);

    // Second call within window — suppressed
    hook.result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(1);

    // flush resets the pipe (covers line 79)
    hook.result.current.flush();

    // After flush, a new pipe is created — next call passes through
    hook.result.current.next(3);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith(3);
  });

  it("flush with pipe resets and next call uses pipe again", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(args: readonly [number]) => void>();

    const hook = renderHook(() =>
      useThrottleCallback(
        {
          callback: _cb,
          pipe: (x: number) => [x * 2] as const,
        },
        100,
      ),
    );

    hook.result.current.next(5);
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith([10]);

    // Suppressed call
    hook.result.current.next(7);
    expect(_cb).toHaveBeenCalledTimes(1);

    // flush (covers line 79 for throttler with pipe)
    hook.result.current.flush();

    // After flush, new pipe — pipe still transforms
    hook.result.current.next(8);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith([16]);
  });

  // ---------------------------------------------------------------------------
  // abort — cancels and resets (Waitable.abort covers line 80)
  // ---------------------------------------------------------------------------

  it("abort cancels throttle window so next call passes immediately", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    // First call fires synchronously
    hook.result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);

    // Second call within window — suppressed
    hook.result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(1);

    // abort cancels current pipe, creates new one (covers line 80)
    hook.result.current.abort();

    // New pipe — next call passes through immediately
    hook.result.current.next(3);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith(3);
  });

  // ---------------------------------------------------------------------------
  // Cleanup on unmount
  // ---------------------------------------------------------------------------

  it("cleanup aborts on unmount", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    // First call fires synchronously (leading edge)
    hook.result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);

    // Suppressed call
    hook.result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(1);

    // Unmount — cleanup calls abort (line 72), sets throttled.current = null (line 73)
    hook.unmount();

    // Run any remaining timers — no more callbacks should fire
    vi.runAllTimers();
    expect(_cb).toHaveBeenCalledTimes(1);
  });

  // ---------------------------------------------------------------------------
  // Wait parameter change — recreates throttle instance
  // ---------------------------------------------------------------------------

  it("recreates throttle instance when wait changes", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const { result, rerender } = renderHook(
      ({ wait }) =>
        useThrottleCallback((x: number) => {
          _cb(x);
        }, wait),
      { initialProps: { wait: 100 as number | undefined } },
    );

    // Call with initial wait=100 — fires immediately (leading edge)
    result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(1);

    // Advance past window
    vi.advanceTimersByTime(100);

    // Change wait — useEffect recreates the throttle instance
    rerender({ wait: 200 });

    // New throttle with wait=200 — fires immediately
    result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith(2);
  });

  // ---------------------------------------------------------------------------
  // Default wait of 1000ms
  // ---------------------------------------------------------------------------

  it("uses default wait of 1000ms when not provided", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useThrottleCallback((x: number) => {
        _cb(x);
      }),
    );

    // First call fires synchronously (leading edge, no wait needed)
    hook.result.current.next(1);
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(1);

    // Suppressed call within default 1000ms window
    hook.result.current.next(2);
    expect(_cb).toHaveBeenCalledTimes(1);

    // After 1000ms window, next call passes through
    vi.advanceTimersByTime(1000);
    hook.result.current.next(3);
    expect(_cb).toHaveBeenCalledTimes(2);
    expect(_cb).toHaveBeenCalledWith(3);
  });

  // ---------------------------------------------------------------------------
  // useDefault — returned object reference is stable across renders
  // ---------------------------------------------------------------------------

  it("returned object reference is stable across renders", () => {
    const _cb = vi.fn();
    const { result, rerender } = renderHook(() =>
      useThrottleCallback(_cb, 100),
    );

    const first = result.current;

    rerender();

    // useDefault ensures the returned object is the same reference
    expect(result.current).toBe(first);
  });
});
