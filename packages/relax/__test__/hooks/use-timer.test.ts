import { renderHook } from "@testing-library/react";
import { useTimer } from "../../src";

describe("useTimeout", () => {
  it("timer", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { result } = renderHook(useTimer);

    expect(fn).toHaveBeenCalledTimes(0);

    result.current.timeout(fn, 1000);
    vi.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("clear timer", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const { result } = renderHook(useTimer);

    expect(fn).toHaveBeenCalledTimes(0);

    result.current.timeout(fn, 1000);
    result.current.clear();

    vi.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it("override timer", async () => {
    vi.useFakeTimers();
    const prevFn = vi.fn();
    const nextFn = vi.fn();

    const { result } = renderHook(useTimer);

    expect(prevFn).toHaveBeenCalledTimes(0);
    result.current.timeout(prevFn, 1000);
    result.current.timeout(nextFn, 500);
    vi.runAllTimers();

    expect(prevFn).toHaveBeenCalledTimes(0);
    expect(nextFn).toHaveBeenCalledTimes(1);
  });

  it("immediate execution when duration is 0", () => {
    const fn = vi.fn();
    const { result } = renderHook(useTimer);

    result.current.timeout(fn, 0);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("immediate execution when duration is negative", () => {
    const fn = vi.fn();
    const { result } = renderHook(useTimer);

    result.current.timeout(fn, -1);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
