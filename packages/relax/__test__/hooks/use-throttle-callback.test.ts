import { renderHook } from "@testing-library/react";
import { useThrottleCallback } from "../../src";

describe("`useThrottleCallback`", () => {
  it("callback args", () => {
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

    expect(_cb).toBeCalledWith(1, 2);
  });

  it("args should be changed by pipe", () => {
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

    expect(_cb).toBeCalledWith([2, 3]);
  });
});
