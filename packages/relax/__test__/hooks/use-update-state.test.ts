import { renderHook, act } from "@testing-library/react";
import { useUpdateState } from "../../src/hooks/use-update-state";

describe("useUpdateState", () => {
  it("returns initial state", () => {
    const { result } = renderHook(() => useUpdateState(0));
    expect(result.current[0]).toBe(0);
  });

  it("returns undefined when no initial state", () => {
    const { result } = renderHook(() => useUpdateState());
    expect(result.current[0]).toBeUndefined();
  });

  it("updates state", () => {
    const { result } = renderHook(() => useUpdateState(0));
    const [, setState] = result.current;

    act(() => {
      setState(1);
    });

    expect(result.current[0]).toBe(1);
  });

  it("triggers callback after state update", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useUpdateState(0));
    const [, setState] = result.current;

    act(() => {
      setState(1, callback);
    });

    expect(result.current[0]).toBe(1);
    // The callback is called via useUpdateEffect, which uses useEffect internally
    expect(callback).toHaveBeenCalledWith(1);
  });

  it("supports functional update", () => {
    const { result } = renderHook(() => useUpdateState(5));
    const [, setState] = result.current;

    act(() => {
      setState((prev) => (prev as number) + 3);
    });

    expect(result.current[0]).toBe(8);
  });

  it("callback not called when not provided", () => {
    const { result } = renderHook(() => useUpdateState(0));
    const [, setState] = result.current;

    // Should not throw
    act(() => {
      setState(10);
    });

    expect(result.current[0]).toBe(10);
  });
});
