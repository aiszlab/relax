/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useDefault, useCounter } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("useDefault", () => {
  it("rerender no changes", async () => {
    const { result, rerender } = renderHook(() => {
      const [count, { add }] = useCounter();
      const defaultValue = useDefault(count);
      return [defaultValue, add] as const;
    });

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(0);

    rerender();
    expect(result.current[0]).toBe(0);
  });

  it("support value getter", () => {
    const { result, rerender } = renderHook(() => {
      const [count, { add }] = useCounter();
      const defaultValue = useDefault(() => count);
      return [defaultValue, add] as const;
    });

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(0);

    rerender();
    expect(result.current[0]).toBe(0);
  });
});
