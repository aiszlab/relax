/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useCounter, useMemorable } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";
import { act } from "react";

describe("useMemorable", () => {
  it("performance", () => {
    const getter = jest.fn();
    const reconciler = jest.fn(() => true);
    const { result } = renderHook(() => {
      const counter = useCounter(0);
      useMemorable(() => getter(), [counter[0]], reconciler);
      return counter;
    });
    expect(getter).toHaveBeenCalledTimes(1);
    expect(reconciler).toHaveBeenCalledTimes(0);
    act(() => {
      result.current[1].add();
    });
    expect(getter).toHaveBeenCalledTimes(2);
    expect(reconciler).toHaveBeenCalledTimes(1);
  });

  it("value update", () => {
    const { result } = renderHook(() => {
      const counter = useCounter(0);
      const _value = useMemorable(
        () => counter[0],
        [counter[0]],
        () => true,
      );

      return [_value, counter[1].add] as const;
    });

    expect(result.current[0]).toBe(0);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(1);
  });

  it("value keep same", () => {
    const { result } = renderHook(() => {
      const counter = useCounter(0);
      const _value = useMemorable(
        () => counter[0],
        [counter[0]],
        () => false,
      );

      return [_value, counter[1].add] as const;
    });

    expect(result.current[0]).toBe(0);
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(0);
  });
});
