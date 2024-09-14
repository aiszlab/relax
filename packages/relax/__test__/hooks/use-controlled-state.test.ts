/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useControlledState, useCounter } from "../../src";
import { act } from "react";

describe("useControlledState", () => {
  it("controlled state", () => {
    const { result } = renderHook(() => {
      const [count, { add }] = useCounter(0);
      const [controlled, setControlled] = useControlledState(count);

      return {
        controlled,
        add,
        setControlled,
      };
    });

    expect(result.current.controlled).toBe(0);

    act(() => {
      result.current.add();
    });
    expect(result.current.controlled).toBe(1);

    // when controlled, setter will not work
    act(() => {
      result.current.setControlled(2);
    });
    expect(result.current.controlled).toBe(1);
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
