/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useIdentity } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("useMount", () => {
  it("normal usage", () => {
    const hook = renderHook(() => useIdentity());
    expect(hook.result.current[0]).toBe("«r0»");
    expect(hook.result.current[1]()).toBe("«r0»0");

    hook.rerender();
    expect(hook.result.current[1]()).toBe("«r0»1");
  });

  it("with test id", async () => {
    const first = renderHook(() => useIdentity("test"));

    expect(first.result.current[0]).toBe("«r1»");
    expect(first.result.current[1]()).toBe("«r1»test:0");
    expect(first.result.current[1]()).toBe("«r1»test:1");

    first.rerender();
    expect(first.result.current[0]).toBe("«r1»");
    expect(first.result.current[1]()).toBe("«r1»test:2");
    expect(first.result.current[1]()).toBe("«r1»test:3");

    const second = renderHook(() => useIdentity("test"));
    expect(second.result.current[0]).toBe("«r2»");
    expect(second.result.current[1]()).toBe("«r2»test:0");
    expect(second.result.current[1]()).toBe("«r2»test:1");
  });
});
