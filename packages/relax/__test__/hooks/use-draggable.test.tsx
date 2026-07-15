import { renderHook } from "@testing-library/react";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { useDraggable } from "../../src";

describe("useDraggable", () => {
  it("returns ref and drag state", () => {
    const { result } = renderHook(() => useDraggable());
    const [ref, state] = result.current;

    expect(ref).toBeDefined();
    expect(ref.current).toBeNull();
    expect(state.isDragging).toBe(false);
  });

  it("registers drag listeners on mount and cleans up", () => {
    // Use a real component to test ref attachment and event listeners
    function DraggableBox() {
      const [ref, state] = useDraggable<HTMLDivElement>();
      return <div ref={ref} data-testid="box" data-dragging={state.isDragging} />;
    }

    const { getByTestId, unmount } = render(<DraggableBox />);
    const box = getByTestId("box");
    expect(box).toBeDefined();

    // After unmount, listeners should be cleaned up
    unmount();
  });

  it("adds window event listeners when isDragging becomes true after mousedown", () => {
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");

    function DraggableBox() {
      const [ref] = useDraggable<HTMLDivElement>();
      return <div ref={ref} data-testid="box" />;
    }

    const { getByTestId } = render(<DraggableBox />);
    const box = getByTestId("box");

    // Clear any addEventListener calls from mount phase (mousedown/touchstart on the element)
    addEventListenerSpy.mockClear();

    // Simulate mousedown to trigger isDragging=true
    // onDragStart sets isDragging=true, causing the useEffect to add window listeners
    fireEvent.mouseDown(box);

    // The useEffect with [isDragging] should have fired, adding window-level listeners
    expect(addEventListenerSpy).toHaveBeenCalledWith("mousemove", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("touchmove", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("mouseup", expect.any(Function));
    expect(addEventListenerSpy).toHaveBeenCalledWith("touchend", expect.any(Function));
  });
});
