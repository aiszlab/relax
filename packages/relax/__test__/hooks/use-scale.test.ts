/**
 * @jest-environment jsdom
 */

import { describe, it, expect } from "@jest/globals";
import { renderHook } from "@testing-library/react";
import { useScale } from "../../src/hooks/use-scale";

describe("useScale", () => {
  it("scale", () => {
    const { result } = renderHook(() => useScale("100px", "200px"));

    // `jsdom`计算不了真实尺寸
    expect(result.current).toBe(0);
  });
});
