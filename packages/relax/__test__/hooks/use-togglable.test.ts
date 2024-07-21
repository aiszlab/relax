/**
 * @jest-environment jsdom
 */

import { renderHook, act } from "@testing-library/react";
import { useTogglable } from "../../src";
import { describe, it, expect } from "@jest/globals";

describe("useTogglable", () => {
  it("toggle", async () => {
    const { result } = renderHook(() =>
      useTogglable([
        {
          key: "node-1",
          children: [{ key: "leaf-1" }, { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] }],
        },
      ]),
    );
    expect(result.current.toggledKeys.size).toBe(0);
    expect(result.current.isToggled("node-1")).toBe(false);

    act(() => {
      result.current.toggle("node-1");
    });
    expect(result.current.toggledKeys.size).toBe(5);
    expect(result.current.isToggled("child-4")).toBe(true);

    act(() => {
      result.current.toggle("leaf-1");
    });
    expect(result.current.toggledKeys.size).toBe(3);
    expect(result.current.isToggled("leaf-1")).toBe(false);
    expect(result.current.isToggled("node-1")).toBe(false);
    expect(result.current.isToggled("child-4")).toBe(true);

    act(() => {
      result.current.toggle("leaf-1");
    });
    expect(result.current.toggledKeys.size).toBe(5);
    expect(result.current.isToggled("child-4")).toBe(true);

    act(() => {
      result.current.toggle("child-3");
    });
    expect(result.current.toggledKeys.size).toBe(2);
    expect(result.current.isToggled("child-3")).toBe(false);
    expect(result.current.isToggled("child-4")).toBe(true);
    expect(result.current.isToggled("node-1")).toBe(false);
  });

  it("toggle single leaf, not effect root node", async () => {
    const { result } = renderHook(() =>
      useTogglable([
        {
          key: "node-1",
          children: [{ key: "leaf-1" }, { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] }],
        },
      ]),
    );

    act(() => {
      result.current.toggle("child-3");
    });
    expect(result.current.toggledKeys.size).toBe(1);
    expect(result.current.isToggled("leaf-2")).toBe(false);
    expect(result.current.isToggled("leaf-1")).toBe(false);
    expect(result.current.isToggled("node-1")).toBe(false);
  });

  it("controlled toggled keys", async () => {
    const { result } = renderHook(() =>
      useTogglable(
        [
          {
            key: "node-1",
            children: [{ key: "leaf-1" }, { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] }],
          },
        ],
        {
          toggledKeys: ["child-3"],
        },
      ),
    );

    expect(result.current.toggledKeys.size).toBe(1);
    act(() => {
      result.current.toggle("child-4");
    });
    expect(result.current.toggledKeys.size).toBe(1);
  });

  it("default toggled keys", async () => {
    const { result } = renderHook(() =>
      useTogglable(
        [
          {
            key: "node-1",
            children: [{ key: "leaf-1" }, { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] }],
          },
        ],
        {
          defaultToggledKeys: ["child-3"],
        },
      ),
    );

    expect(result.current.toggledKeys.size).toBe(1);
    act(() => {
      result.current.toggle("child-4");
    });
    expect(result.current.toggledKeys.size).toBe(3);
  });
});
