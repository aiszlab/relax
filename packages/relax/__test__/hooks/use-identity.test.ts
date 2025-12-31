/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useIdentity } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("useMount", () => {
  it("normal usage", () => {
    const hook = renderHook(() => useIdentity());
    expect(hook.result.current[0]).toBe("_r_0_");
    expect(hook.result.current[1]()).toBe("_r_0_0");

    hook.rerender();
    expect(hook.result.current[1]()).toBe("_r_0_1");
  });

  it("with test id", async () => {
    const first = renderHook(() => useIdentity("test"));

    expect(first.result.current[0]).toBe("_r_1_");
    expect(first.result.current[1]()).toBe("_r_1_test_0");
    expect(first.result.current[1]()).toBe("_r_1_test_1");

    first.rerender();
    expect(first.result.current[0]).toBe("_r_1_");
    expect(first.result.current[1]()).toBe("_r_1_test_2");
    expect(first.result.current[1]()).toBe("_r_1_test_3");

    const second = renderHook(() => useIdentity("test"));
    expect(second.result.current[0]).toBe("_r_2_");
    expect(second.result.current[1]()).toBe("_r_2_test_0");
    expect(second.result.current[1]()).toBe("_r_2_test_1");
  });
});
