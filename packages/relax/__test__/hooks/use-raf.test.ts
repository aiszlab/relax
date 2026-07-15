import { renderHook, act } from "@testing-library/react";
import { useRaf } from "../../src";

describe("useRaf", () => {
  it("returns a stable function", () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useRaf(callback));

    const fn1 = result.current;
    rerender();
    const fn2 = result.current;

    expect(fn1).toBe(fn2);
  });

  it("calls callback via requestAnimationFrame", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useRaf(callback));

    act(() => {
      result.current("arg");
    });

    expect(callback).not.toHaveBeenCalled();

    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("arg");
  });

  it("calls immediately when timely is true", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useRaf(callback, { timely: true }));

    act(() => {
      result.current("immediate");
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith("immediate");
  });

  it("debounces calls within same frame", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useRaf(callback));

    act(() => {
      result.current("a");
      result.current("b");
      result.current("c");
    });

    vi.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("cancels pending animation on unmount", () => {
    vi.useFakeTimers();
    const cancelSpy = vi.spyOn(window, "cancelAnimationFrame");
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useRaf(callback));

    act(() => {
      result.current("test");
    });

    unmount();

    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });
});
