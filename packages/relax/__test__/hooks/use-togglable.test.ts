import { renderHook, act } from "@testing-library/react";
import { useToggleable } from "../../src";

describe("useTogglable", () => {
  it("toggle", async () => {
    const { result } = renderHook(() =>
      useToggleable([
        {
          key: "node-1",
          children: [
            { key: "leaf-1" },
            { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] },
          ],
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
      useToggleable([
        {
          key: "node-1",
          children: [
            { key: "leaf-1" },
            { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] },
          ],
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
    const onToggle = vi.fn();
    const { result } = renderHook(() =>
      useToggleable(
        [
          {
            key: "node-1",
            children: [
              { key: "leaf-1" },
              { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] },
            ],
          },
        ],
        {
          toggledKeys: ["child-3"],
          onToggle,
        },
      ),
    );

    expect(result.current.toggledKeys.size).toBe(1);
    act(() => {
      result.current.toggle("child-4");
    });
    expect(result.current.toggledKeys.size).toBe(1);
    expect(onToggle).toHaveBeenCalled();
  });

  it("default toggled keys", async () => {
    const { result } = renderHook(() =>
      useToggleable(
        [
          {
            key: "node-1",
            children: [
              { key: "leaf-1" },
              { key: "leaf-2", children: [{ key: "child-3" }, { key: "child-4" }] },
            ],
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

  it("isDefaultToggled option", async () => {
    const { result } = renderHook(() =>
      useToggleable(
        [
          {
            key: "node-1",
            children: [{ key: "leaf-1" }],
          },
        ],
        {
          isDefaultToggled: true,
        },
      ),
    );

    // All keys should be toggled by default
    expect(result.current.toggledKeys.size).toBe(2);
    expect(result.current.isToggled("node-1")).toBe(true);
    expect(result.current.isToggled("leaf-1")).toBe(true);
  });

  it("removes children when toggling a parent OFF (line 200)", () => {
    const { result } = renderHook(() =>
      useToggleable([
        {
          key: "parent",
          children: [{ key: "child-a" }, { key: "child-b" }],
        },
      ]),
    );

    // Toggle parent ON -- all children also get toggled via rise()
    act(() => {
      result.current.toggle("parent");
    });
    expect(result.current.toggledKeys.size).toBe(3);
    expect(result.current.isToggled("parent")).toBe(true);
    expect(result.current.isToggled("child-a")).toBe(true);
    expect(result.current.isToggled("child-b")).toBe(true);

    // Toggle parent OFF -- hits fell.delete(leaf.key) in fall()
    // for each child, exercising line 200
    act(() => {
      result.current.toggle("parent");
    });
    expect(result.current.toggledKeys.size).toBe(0);
    expect(result.current.isToggled("parent")).toBe(false);
    expect(result.current.isToggled("child-a")).toBe(false);
    expect(result.current.isToggled("child-b")).toBe(false);
  });
});
