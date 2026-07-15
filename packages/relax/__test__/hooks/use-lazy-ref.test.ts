import { renderHook } from "@testing-library/react";
import { useLazyRef } from "../../src";

describe("useLazyRef", () => {
  it("returns a getter function", () => {
    const { result } = renderHook(() => useLazyRef(() => 42));
    const getter = result.current;

    expect(typeof getter).toBe("function");
    expect(getter()).toBe(42);
  });

  it("calls getter only once", () => {
    const getterFn = vi.fn(() => ({ complex: "object" }));
    const { result } = renderHook(() => useLazyRef(getterFn));
    const getter = result.current;

    const val1 = getter();
    const val2 = getter();
    const val3 = getter();

    expect(val1).toBe(val2);
    expect(val2).toBe(val3);
    expect(getterFn).toHaveBeenCalledTimes(1);
  });

  it("returns null-safe initial value", () => {
    const { result } = renderHook(() => useLazyRef(() => null));
    const getter = result.current;

    expect(getter()).toBeNull();
  });
});
