/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useEvent } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("useEvent", () => {
  it("keep method same", async () => {
    const hook = renderHook(() => {
      return {
        different: () => {},
        same: useEvent(() => {}),
      };
    });
    const same = hook.result.current.same;
    const different = hook.result.current.different;

    hook.rerender();

    const _same = hook.result.current.same;
    const _different = hook.result.current.different;

    expect(_same === same).toBe(true);
    expect(_different === different).toBe(false);
  });
});
