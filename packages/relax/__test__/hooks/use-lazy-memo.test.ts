/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useCounter, useEvent, useLazyMemo } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";
import { act, useMemo } from "react";

describe("useLazyMemo", () => {
  it("lazy performance", () => {
    const getter = jest.fn();

    const { result } = renderHook(() => {
      const counter = useCounter(0);

      const memoValue = useLazyMemo(() => {
        getter();
        return counter[0];
      }, [counter[0]]);

      const getValue = useEvent(() => {
        return memoValue.value;
      });

      return {
        memoValue,
        add: counter[1].add,
        getValue,
      };
    });

    expect(getter).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.getValue();
    });

    expect(getter).toHaveBeenCalledTimes(1);
  });

  it("deps watcher feature", () => {
    const mockFnInLazy = jest.fn();
    const mockFnInSync = jest.fn();

    const { result } = renderHook(() => {
      const counter = useCounter(0);

      const lazyValue = useLazyMemo(() => {
        mockFnInLazy();
        return counter[0];
      }, [counter[0]]);

      const syncValue = useMemo(() => {
        mockFnInSync();
        return counter[0];
      }, [counter[0]]);

      const getLazyValue = useEvent(() => {
        return lazyValue.value;
      });

      return {
        lazyValue,
        syncValue,
        add: counter[1].add,
        getLazyValue,
      };
    });

    expect(mockFnInLazy).toHaveBeenCalledTimes(0);
    expect(mockFnInSync).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.getLazyValue();
    });

    expect(mockFnInLazy).toHaveBeenCalledTimes(1);
    expect(mockFnInSync).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.add(1);
    });

    expect(mockFnInLazy).toHaveBeenCalledTimes(1);
    expect(mockFnInSync).toHaveBeenCalledTimes(2);

    act(() => {
      result.current.getLazyValue();
    });

    expect(mockFnInLazy).toHaveBeenCalledTimes(2);
    expect(mockFnInSync).toHaveBeenCalledTimes(2);
  });
});
