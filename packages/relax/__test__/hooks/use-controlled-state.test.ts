/**
 * @jest-environment jsdom
 */

import { describe, expect, it, jest } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useControlledState } from "../../src";
import { act, useState } from "react";

describe("useControlledState", () => {
  it("normal usage like `useState`", () => {
    const { result } = renderHook(() => useControlledState<number>());

    expect(result.current[0]).toBeUndefined();
    act(() => {
      result.current[1](1);
    });
    expect(result.current[0]).toBe(1);
  });

  it("with default state", () => {
    const { result } = renderHook(() => {
      const [_count, setCount] = useState<number>();
      const [count] = useControlledState(_count, { defaultState: 0 });

      return {
        count,
        setCount,
      };
    });

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.setCount(13);
    });
    expect(result.current.count).toBe(13);
    act(() => {
      result.current.setCount(void 0);
    });
    expect(result.current.count).toBe(0);
  });

  it("change controlled to uncontrolled", () => {
    const { result } = renderHook(() => {
      const [_count, setCount] = useState<number | undefined>(10);
      const [count] = useControlledState(_count);
      return {
        count,
        setCount,
      };
    });

    expect(result.current.count).toBe(10);

    act(() => {
      result.current.setCount(void 0);
    });
    expect(result.current.count).toBe(10);
  });

  it("controlled state", () => {
    const _cb = jest.fn<(x?: number[]) => void>();
    const { result } = renderHook(() => {
      const [results, setResults] = useState<number[]>([]);
      const [controlledValue, setControlledValue] = useControlledState<number[]>(results, {
        onChange: _cb,
      });

      return {
        controlledValue,
        setResults,
        setControlledValue,
      };
    });

    expect(result.current.controlledValue.length).toBe(0);

    act(() => {
      result.current.setResults([1]);
    });
    expect(result.current.controlledValue.length).toBe(1);

    // when controlled, setter will not work
    act(() => {
      result.current.setControlledValue([1, 2]);
    });

    expect(_cb).toBeCalledWith([1, 2]);
    expect(result.current.controlledValue.length).toBe(1);
  });

  it("uncontrolled state", () => {
    const { result } = renderHook(() => useControlledState(void 0, { defaultState: 0 }));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1](13);
    });
    expect(result.current[0]).toBe(13);
  });
});
