/**
 * @jest-environment jsdom
 */

import { renderHook } from "@testing-library/react";
import { useUnmount } from "../../src";
import { describe, it, expect, jest } from "@jest/globals";

describe("useMount", () => {
  it("unmount", () => {
    const runner = jest.fn();
    const hook = renderHook(() =>
      useUnmount(() => {
        runner();
      }),
    );

    expect(runner).toHaveBeenCalledTimes(0);
    hook.unmount();
    expect(runner).toHaveBeenCalledTimes(1);
  });
});
