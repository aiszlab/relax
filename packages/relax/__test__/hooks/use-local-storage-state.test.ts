/**
 * @jest-environment jsdom
 */

import { describe, expect, test } from "@jest/globals";
import { useLocalStorageState } from "../../src";
import { renderHook } from "@testing-library/react";
import { act } from "react";

describe("`useLocalStorageState`", () => {
  test("normal running like `useState`", () => {
    const { result } = renderHook(() => useLocalStorageState("local-storage1"));

    expect(result.current[0]).toBeNull();
    act(() => {
      result.current[1]("hello");
    });
    expect(result.current[0]).toBe("hello");
  });

  test("sync storage in multiple page", () => {
    const { result: result1 } = renderHook(() => useLocalStorageState("local-storage2"));
    const { result: result2 } = renderHook(() => useLocalStorageState("local-storage2"));

    expect(result1.current[0]).toBeNull();
    expect(result2.current[0]).toBeNull();

    act(() => {
      result1.current[1]("hello");
    });

    expect(result1.current[0]).toBe("hello");
  });
});
