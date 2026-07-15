import { renderHook } from "@testing-library/react";
import { useDebounceCallback } from "../../src";

describe("`useDebounceCallback`", () => {
  it("callback args", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number, y: number) => void>();

    const hook = renderHook(() =>
      useDebounceCallback((x: number, y: number) => {
        _cb(x, y);
      }, 32),
    );

    hook.result.current.next(1, 2);
    hook.result.current.next(3, 4);

    vi.runOnlyPendingTimers();

    expect(_cb).toBeCalledWith(3, 4);
  });

  it("args should be changed by pipe", () => {
    vi.useFakeTimers();

    const _cb = vi.fn<(args: readonly [number, number]) => void>();

    const hook = renderHook(() =>
      useDebounceCallback(
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

    expect(_cb).toBeCalledWith([4, 5]);
  });

  it("aborts on unmount", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useDebounceCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    hook.result.current.next(1);
    hook.unmount();

    vi.runAllTimers();
    expect(_cb).not.toHaveBeenCalled();
  });

  it("uses default wait of 1000ms", () => {
    vi.useFakeTimers();
    const _cb = vi.fn();

    const hook = renderHook(() =>
      useDebounceCallback((x: number) => {
        _cb(x);
      }),
    );

    hook.result.current.next(42);
    // Should not have been called yet at 500ms (default wait is 1000)
    vi.advanceTimersByTime(500);
    expect(_cb).not.toHaveBeenCalled();

    // Should be called after 1000ms
    vi.advanceTimersByTime(600);
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(42);
  });

  it("flush executes the pending callback immediately", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useDebounceCallback((x: number) => {
        _cb(x);
      }, 1000),
    );

    hook.result.current.next(42);

    // Should not have been called yet
    expect(_cb).not.toHaveBeenCalled();

    // flush should immediately invoke the callback
    hook.result.current.flush();
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(42);
  });

  it("flush with pipe callback", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(args: readonly [number, number]) => void>();

    const hook = renderHook(() =>
      useDebounceCallback(
        {
          callback: _cb,
          pipe: (x: number, y: number) => [x + y] as const,
        },
        100,
      ),
    );

    hook.result.current.next(3, 5);
    expect(_cb).not.toHaveBeenCalled();

    hook.result.current.flush();
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith([8]);
  });

  it("multiple next calls with flush only fires the last value", () => {
    vi.useFakeTimers();
    const _cb = vi.fn<(x: number) => void>();

    const hook = renderHook(() =>
      useDebounceCallback((x: number) => {
        _cb(x);
      }, 100),
    );

    hook.result.current.next(1);
    hook.result.current.next(2);
    hook.result.current.next(3);

    hook.result.current.flush();
    expect(_cb).toHaveBeenCalledTimes(1);
    expect(_cb).toHaveBeenCalledWith(3);
  });
});
