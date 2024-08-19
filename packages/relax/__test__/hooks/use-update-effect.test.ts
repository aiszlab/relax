/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useCounter, useUpdateEffect } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";
import { act, useEffect } from "react";

describe("useUpdateEffect", () => {
  it("effect will only run after mounted", () => {
    const updateEffect = jest.fn();
    const normalEffect = jest.fn();

    const hook = renderHook(() => {
      useEffect(() => {
        normalEffect();
      });

      useUpdateEffect(() => {
        updateEffect();
      });
    });

    expect(normalEffect).toHaveBeenCalledTimes(1);
    expect(updateEffect).toHaveBeenCalledTimes(0);

    hook.rerender();
    expect(normalEffect).toHaveBeenCalledTimes(2);
    expect(updateEffect).toHaveBeenCalledTimes(1);
  });

  it("effect will never run with empty deps", () => {
    const effect = jest.fn();

    const hook = renderHook(() =>
      useUpdateEffect(() => {
        effect();
      }, []),
    );

    expect(effect).toHaveBeenCalledTimes(0);

    hook.rerender();
    expect(effect).toHaveBeenCalledTimes(0);
  });

  it("effect will only auto run after deps changed", () => {
    const effect = jest.fn();

    const hook = renderHook(() => {
      const [count, { add }] = useCounter(0);

      useUpdateEffect(() => {
        effect();
      }, [count]);

      return add;
    });

    expect(effect).toHaveBeenCalledTimes(0);

    hook.rerender();
    expect(effect).toHaveBeenCalledTimes(0);

    act(() => {
      hook.result.current();
    });
    expect(effect).toHaveBeenCalledTimes(1);
  });
});
