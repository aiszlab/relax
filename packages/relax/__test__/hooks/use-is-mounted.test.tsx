/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useIsMounted } from "../../src";
import { useEffect, useRef } from "react";

describe("`useIsMounted`", () => {
  test("should return true after first render", () => {
    const { result } = renderHook(() => useIsMounted());
    expect(result.current()).toBe(true);
  });

  test("render times would add plus one by setting `rerender`", () => {
    const useMountedCount = (rerender: boolean) => {
      const _count = useRef(0);

      useEffect(() => {
        _count.current = _count.current + 1;
      });

      useIsMounted({ rerender });

      return _count;
    };

    const { result: resultWithoutRerender } = renderHook(() => useMountedCount(false));
    const { result: resultWithRerender } = renderHook(() => useMountedCount(true));

    expect(resultWithoutRerender.current.current).toBe(1);
    expect(resultWithRerender.current.current).toBe(2);
  });
});
