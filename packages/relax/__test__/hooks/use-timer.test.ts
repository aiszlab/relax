/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useTimer } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";

describe("useTimeout", () => {
  it("timer", async () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const { result } = renderHook(useTimer);

    expect(fn).toHaveBeenCalledTimes(0);

    result.current.timeout(fn, 1000);
    jest.runOnlyPendingTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("clear timer", async () => {
    jest.useFakeTimers();
    const fn = jest.fn();
    const { result } = renderHook(useTimer);

    expect(fn).toHaveBeenCalledTimes(0);

    result.current.timeout(fn, 1000);
    result.current.clear();

    jest.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(0);
  });

  it("override timer", async () => {
    jest.useFakeTimers();
    const prevFn = jest.fn();
    const nextFn = jest.fn();

    const { result } = renderHook(useTimer);

    expect(prevFn).toHaveBeenCalledTimes(0);
    result.current.timeout(prevFn, 1000);
    result.current.timeout(nextFn, 500);
    jest.runAllTimers();

    expect(prevFn).toHaveBeenCalledTimes(0);
    expect(nextFn).toHaveBeenCalledTimes(1);
  });
});
