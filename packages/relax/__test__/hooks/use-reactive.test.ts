/**
 * @jest-environment jsdom
 */

import { jest, describe, it, expect } from "@jest/globals";
import { useReactive } from "../../src";
import { renderHook } from "@testing-library/react";
import { act } from "react";

describe("useReactive", () => {
  it("sync value", () => {
    const { result } = renderHook(() => useReactive(1));

    expect(result.current.value).toBe(1);

    act(() => {
      result.current.value = 2;
    });
    expect(result.current.value).toBe(2);
  });
});
