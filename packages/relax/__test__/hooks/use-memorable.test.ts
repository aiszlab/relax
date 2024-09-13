/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useMemorable } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";

describe("useMemorable", () => {
  it("performance", async () => {
    const getter = jest.fn();
    const reconciler = jest.fn(() => true);

    renderHook(() => useMemorable(() => getter(), [], reconciler));

    expect(getter).toHaveBeenCalledTimes(1);
    expect(reconciler).toHaveBeenCalledTimes(0);
  });
});
