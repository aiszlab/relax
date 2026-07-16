import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useToggleable } from "../../src";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Flat keys — no nesting */
const flatKeys = [{ key: "a" }, { key: "b" }, { key: "c" }];

/** Two-level tree: root with children */
const treeKeys = [
  { key: "parent", children: [{ key: "child-1" }, { key: "child-2" }] },
];

/** Deeply nested: three levels */
const deepKeys = [
  {
    key: "1",
    children: [
      {
        key: "1-1",
        children: [{ key: "1-1-1" }, { key: "1-1-2" }],
      },
      { key: "1-2" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("useToggleable", () => {
  // -------------------------------------------------------------------------
  // Empty / edge cases
  // -------------------------------------------------------------------------

  it("handles empty toggleableKeys array", () => {
    const { result } = renderHook(() => useToggleable([]));
    expect(result.current.toggledKeys.size).toBe(0);
    expect(result.current.isToggled("any")).toBe(false);
  });

  it("toggle on non-existent key does nothing (no grouped leaves)", () => {
    // Covers Tree.toggleBy line 123: #groupedLeaves.get(key) ?? []
    const { result } = renderHook(() => useToggleable(flatKeys));

    act(() => {
      result.current.toggle("non-existent");
    });

    // To verify toggle was called, check we set the onToggle callback
    // Without onToggle, toggle is a no-op for non-existent keys
  });

  // -------------------------------------------------------------------------
  // isDefaultToggled
  // -------------------------------------------------------------------------

  it("isDefaultToggled=true toggles all keys", () => {
    const { result } = renderHook(() =>
      useToggleable(flatKeys, { isDefaultToggled: true }),
    );

    expect(result.current.isToggled("a")).toBe(true);
    expect(result.current.isToggled("b")).toBe(true);
    expect(result.current.isToggled("c")).toBe(true);
  });

  it("isDefaultToggled=false with no defaultToggledKeys toggles nothing", () => {
    const { result } = renderHook(() => useToggleable(flatKeys));

    expect(result.current.isToggled("a")).toBe(false);
    expect(result.current.isToggled("b")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // defaultToggledKeys
  // -------------------------------------------------------------------------

  it("defaultToggledKeys starts with specified keys toggled", () => {
    const { result } = renderHook(() =>
      useToggleable(flatKeys, { defaultToggledKeys: ["a", "c"] }),
    );

    expect(result.current.isToggled("a")).toBe(true);
    expect(result.current.isToggled("b")).toBe(false);
    expect(result.current.isToggled("c")).toBe(true);
  });

  // -------------------------------------------------------------------------
  // isToggled
  // -------------------------------------------------------------------------

  it("isToggled returns false for unknown key", () => {
    const { result } = renderHook(() => useToggleable(flatKeys));
    expect(result.current.isToggled("unknown")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Toggle: basic add / remove
  // -------------------------------------------------------------------------

  it("toggle adds a key when it was not toggled", () => {
    const { result } = renderHook(() => useToggleable(flatKeys));

    act(() => {
      result.current.toggle("a");
    });

    expect(result.current.isToggled("a")).toBe(true);
  });

  it("toggle removes a key when it was toggled", () => {
    const { result } = renderHook(() =>
      useToggleable(flatKeys, { defaultToggledKeys: ["a"] }),
    );

    expect(result.current.isToggled("a")).toBe(true);

    act(() => {
      result.current.toggle("a");
    });

    expect(result.current.isToggled("a")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // onToggle callback
  // -------------------------------------------------------------------------

  it("onToggle is called with updated keys after toggle", () => {
    const onToggle = vi.fn();
    const { result } = renderHook(() =>
      useToggleable(flatKeys, { onToggle }),
    );

    act(() => {
      result.current.toggle("a");
    });

    expect(onToggle).toHaveBeenCalledTimes(1);
    expect(onToggle).toHaveBeenCalledWith(["a"]);
  });

  it("onToggle is called when toggling off", () => {
    const onToggle = vi.fn();
    const { result } = renderHook(() =>
      useToggleable(flatKeys, { defaultToggledKeys: ["a"], onToggle }),
    );

    act(() => {
      result.current.toggle("a");
    });

    expect(onToggle).toHaveBeenCalledWith([]);
  });

  // -------------------------------------------------------------------------
  // Fall propagation: toggle parent → children toggle
  // -------------------------------------------------------------------------

  it("toggle parent toggles all children (fall propagation)", () => {
    const { result } = renderHook(() => useToggleable(treeKeys));

    act(() => {
      result.current.toggle("parent");
    });

    expect(result.current.isToggled("parent")).toBe(true);
    expect(result.current.isToggled("child-1")).toBe(true);
    expect(result.current.isToggled("child-2")).toBe(true);
  });

  it("untoggle parent untoggles all children (fall propagation)", () => {
    const { result } = renderHook(() =>
      useToggleable(treeKeys, { isDefaultToggled: true }),
    );

    // All toggled initially
    expect(result.current.isToggled("parent")).toBe(true);
    expect(result.current.isToggled("child-1")).toBe(true);
    expect(result.current.isToggled("child-2")).toBe(true);

    act(() => {
      result.current.toggle("parent");
    });

    expect(result.current.isToggled("parent")).toBe(false);
    expect(result.current.isToggled("child-1")).toBe(false);
    expect(result.current.isToggled("child-2")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Rise propagation: toggle all children → parent toggles
  // -------------------------------------------------------------------------

  it("toggle all children rises to toggle parent", () => {
    const { result } = renderHook(() => useToggleable(treeKeys));

    act(() => {
      result.current.toggle("child-1");
    });

    expect(result.current.isToggled("child-1")).toBe(true);
    // Only one child toggled, parent should NOT be toggled yet
    expect(result.current.isToggled("parent")).toBe(false);

    act(() => {
      result.current.toggle("child-2");
    });

    expect(result.current.isToggled("child-2")).toBe(true);
    // All children toggled → parent should rise
    expect(result.current.isToggled("parent")).toBe(true);
  });

  it("untoggle one child unrises parent", () => {
    // Start with all toggled
    const { result } = renderHook(() =>
      useToggleable(treeKeys, { isDefaultToggled: true }),
    );

    expect(result.current.isToggled("parent")).toBe(true);

    act(() => {
      result.current.toggle("child-1");
    });

    // One child untoggled → parent should unrise
    expect(result.current.isToggled("parent")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Deep nesting: three levels
  // -------------------------------------------------------------------------

  it("deep fall: toggle root toggles all descendants", () => {
    const { result } = renderHook(() => useToggleable(deepKeys));

    act(() => {
      result.current.toggle("1");
    });

    expect(result.current.isToggled("1")).toBe(true);
    expect(result.current.isToggled("1-1")).toBe(true);
    expect(result.current.isToggled("1-2")).toBe(true);
    expect(result.current.isToggled("1-1-1")).toBe(true);
    expect(result.current.isToggled("1-1-2")).toBe(true);
  });

  it("deep rise: toggle all leaf children rises through multiple levels", () => {
    const { result } = renderHook(() => useToggleable(deepKeys));

    // Toggle deepest children one at a time — each toggle needs its own
    // act() so React can commit the state update before the next toggle,
    // otherwise they both read the same initial (empty) toggledKeys set.
    act(() => {
      result.current.toggle("1-1-1");
    });

    act(() => {
      result.current.toggle("1-1-2");
    });

    // "1-1" should rise (all its children toggled)
    expect(result.current.isToggled("1-1")).toBe(true);

    // But "1" should NOT rise yet (1-2 is not toggled)
    expect(result.current.isToggled("1")).toBe(false);

    // Toggle the remaining child
    act(() => {
      result.current.toggle("1-2");
    });

    // Now "1" should rise
    expect(result.current.isToggled("1")).toBe(true);
  });

  it("deep untoggle: unchecking root untoggles all descendants", () => {
    const { result } = renderHook(() =>
      useToggleable(deepKeys, { isDefaultToggled: true }),
    );

    act(() => {
      result.current.toggle("1");
    });

    expect(result.current.isToggled("1")).toBe(false);
    expect(result.current.isToggled("1-1")).toBe(false);
    expect(result.current.isToggled("1-2")).toBe(false);
    expect(result.current.isToggled("1-1-1")).toBe(false);
    expect(result.current.isToggled("1-1-2")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Multiple leaves with the same key (Tree.collect grouping)
  // -------------------------------------------------------------------------

  it("handles multiple leaves with the same key (collect line 101-102)", () => {
    // Covers Tree.collect: key already exists → add to existing set
    const duplicateKeys = [
      { key: "shared" },
      { key: "shared" }, // same key → grouped in #groupedLeaves
    ];

    const { result } = renderHook(() => useToggleable(duplicateKeys));

    act(() => {
      result.current.toggle("shared");
    });

    expect(result.current.isToggled("shared")).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Leaf with empty/undefined children
  // -------------------------------------------------------------------------

  it("leaf with undefined children (grow returns early)", () => {
    // Covers Leaf.grow line 158: children.length === 0 → return this
    const keys = [{ key: "leaf-only" }];
    const { result } = renderHook(() => useToggleable(keys));

    act(() => {
      result.current.toggle("leaf-only");
    });

    expect(result.current.isToggled("leaf-only")).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Controlled mode: toggledKeys prop
  // -------------------------------------------------------------------------

  it("controlled mode: uses toggledKeys prop instead of internal state", () => {
    const onToggle = vi.fn();
    const { result, rerender } = renderHook(
      ({ toggledKeys }) =>
        useToggleable(flatKeys, { toggledKeys, onToggle }),
      { initialProps: { toggledKeys: ["a"] as string[] } },
    );

    expect(result.current.isToggled("a")).toBe(true);
    expect(result.current.isToggled("b")).toBe(false);

    // Update controlled keys externally
    rerender({ toggledKeys: ["b"] });

    expect(result.current.isToggled("a")).toBe(false);
    expect(result.current.isToggled("b")).toBe(true);
  });

  // -------------------------------------------------------------------------
  // Tree re-creation when toggleableKeys changes
  // -------------------------------------------------------------------------

  it("recreates tree when toggleableKeys change", () => {
    const { result, rerender } = renderHook(
      ({ keys }) => useToggleable(keys),
      { initialProps: { keys: flatKeys } },
    );

    // Initially has flatKeys
    act(() => {
      result.current.toggle("a");
    });
    expect(result.current.isToggled("a")).toBe(true);

    // Change to different keys — tree is rebuilt.
    // The internal toggledKeys state is preserved (its defaultState
    // only runs on initial mount), so "a" remains in the state.
    // But "a" exists in the original tree only.
    rerender({ keys: [{ key: "x" }] });

    // State preserved — "a" stays toggled from the previous toggle
    expect(result.current.isToggled("a")).toBe(true);
    // New key "x" starts untoggled
    expect(result.current.isToggled("x")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Toggle multiple times (idempotency)
  // -------------------------------------------------------------------------

  it("toggling the same key twice returns to original state", () => {
    const { result } = renderHook(() => useToggleable(flatKeys));

    act(() => {
      result.current.toggle("a");
    });
    expect(result.current.isToggled("a")).toBe(true);

    act(() => {
      result.current.toggle("a");
    });
    expect(result.current.isToggled("a")).toBe(false);
  });

  // -------------------------------------------------------------------------
  // Unrelated key toggle does not affect other keys
  // -------------------------------------------------------------------------

  it("toggling one key does not affect unrelated keys", () => {
    const { result } = renderHook(() => useToggleable(flatKeys));

    act(() => {
      result.current.toggle("a");
    });

    expect(result.current.isToggled("a")).toBe(true);
    expect(result.current.isToggled("b")).toBe(false);
    expect(result.current.isToggled("c")).toBe(false);
  });
});
