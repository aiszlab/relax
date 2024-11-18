/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useDebounceCallback } from "../../src";

describe("`useDebounceCallback`", () => {
  it("callback args", () => {
    jest.useFakeTimers();
    const _cb = jest.fn<(x: number, y: number) => void>();

    const hook = renderHook(() =>
      useDebounceCallback((x: number, y: number) => {
        _cb(x, y);
      }, 32),
    );

    hook.result.current.next(1, 2);
    hook.result.current.next(3, 4);

    jest.runOnlyPendingTimers();

    expect(_cb).toBeCalledWith(3, 4);
  });

  it("args should be changed by pipe", () => {
    jest.useFakeTimers();

    const _cb = jest.fn<(args: readonly [number, number]) => void>();

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

    jest.runOnlyPendingTimers();

    expect(_cb).toBeCalledWith([4, 5]);
  });
});
