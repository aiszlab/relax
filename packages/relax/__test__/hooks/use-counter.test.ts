/**
 * @jest-environment jsdom
 */

import { describe, expect, it } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useCounter } from "../../src";
import { act } from "react";

describe("useCounter", () => {
  it("counter", () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1].add();
    });
    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1].subtract();
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1].setCount(5);
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].reset();
    });
    expect(result.current[0]).toBe(0);
  });

  it("max", () => {
    const { result } = renderHook(() => useCounter(2, { max: 5 }));

    expect(result.current[0]).toBe(2);

    act(() => {
      result.current[1].last();
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].add();
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].setCount(10);
    });
    expect(result.current[0]).toBe(5);
  });

  it("min", () => {
    const { result } = renderHook(() => useCounter(2, { min: 0 }));
    expect(result.current[0]).toBe(2);

    act(() => {
      result.current[1].first();
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1].subtract();
    });
    expect(result.current[0]).toBe(0);

    act(() => {
      result.current[1].setCount(-5);
    });
    expect(result.current[0]).toBe(0);
  });
});
