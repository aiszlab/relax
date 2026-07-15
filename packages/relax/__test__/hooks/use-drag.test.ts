import { renderHook, act } from "@testing-library/react";
import { useDrag } from "../../src";

/**
 * Helper to create a MouseEvent with pageX/pageY properties set.
 * jsdom's MouseEvent constructor doesn't support pageX/pageY via init dict.
 */
function createMouseEvent(
  type: string,
  opts: { pageX?: number; pageY?: number; offsetX?: number; offsetY?: number } = {},
): MouseEvent {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(event, "pageX", { value: opts.pageX ?? 0 });
  Object.defineProperty(event, "pageY", { value: opts.pageY ?? 0 });
  Object.defineProperty(event, "offsetX", { value: opts.offsetX ?? 0 });
  Object.defineProperty(event, "offsetY", { value: opts.offsetY ?? 0 });
  return event;
}

describe("useDrag", () => {
  it("returns initial drag state", () => {
    const { result } = renderHook(() => useDrag());
    const [state] = result.current;

    expect(state.isDragging).toBe(false);
    expect(state.isDragged).toBe(false);
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
    expect(state.movementX).toBe(0);
    expect(state.movementY).toBe(0);
  });

  it("sets isDragging on drag start with mouse event", () => {
    const { result } = renderHook(() => useDrag());
    const [, { onDragStart }] = result.current;

    act(() => {
      onDragStart(createMouseEvent("mousedown", { pageX: 100, pageY: 200 }));
    });

    const [state] = result.current;
    expect(state.isDragging).toBe(true);
    expect(state.isDragged).toBe(true);
    expect(state.x).toBe(100);
    expect(state.y).toBe(200);
  });

  it("calls onDragStart callback", () => {
    const onDragStart = vi.fn();
    const { result } = renderHook(() => useDrag({ onDragStart }));
    const [, { onDragStart: startDrag }] = result.current;

    act(() => {
      startDrag(createMouseEvent("mousedown", { pageX: 10, pageY: 20 }));
    });

    expect(onDragStart).toHaveBeenCalledTimes(1);
    expect(onDragStart).toHaveBeenCalledWith(
      expect.objectContaining({ isDragging: true, x: 10, y: 20 }),
    );
  });

  it("tracks movement on drag move", () => {
    const { result } = renderHook(() => useDrag());
    const [, { onDragStart, onDragMove }] = result.current;

    act(() => {
      onDragStart(createMouseEvent("mousedown", { pageX: 100, pageY: 100 }));
    });

    act(() => {
      onDragMove(createMouseEvent("mousemove", { pageX: 150, pageY: 120 }));
    });

    const [state] = result.current;
    expect(state.movementX).toBe(50);
    expect(state.movementY).toBe(20);
  });

  it("calls onDragMove callback when moving while dragging", () => {
    const onDragMove = vi.fn();
    const { result } = renderHook(() => useDrag({ onDragMove }));
    const [, { onDragStart, onDragMove: moveDrag }] = result.current;

    act(() => {
      onDragStart(createMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
    });

    act(() => {
      moveDrag(createMouseEvent("mousemove", { pageX: 10, pageY: 20 }));
    });

    expect(onDragMove).toHaveBeenCalledWith(
      expect.objectContaining({ movementX: 10, movementY: 20 }),
    );
  });

  it("ends drag correctly", () => {
    const { result } = renderHook(() => useDrag());
    const [, { onDragStart, onDragEnd }] = result.current;

    act(() => {
      onDragStart(
        createMouseEvent("mousedown", { pageX: 100, pageY: 100, offsetX: 10, offsetY: 10 }),
      );
    });

    act(() => {
      onDragEnd(createMouseEvent("mouseup", { pageX: 200, pageY: 200 }));
    });

    const [state] = result.current;
    expect(state.isDragging).toBe(false);
    expect(state.isDragged).toBe(true);
  });

  it("calls onDragEnd callback", () => {
    const onDragEnd = vi.fn();
    const { result } = renderHook(() => useDrag({ onDragEnd }));
    const [, { onDragStart, onDragEnd: endDrag }] = result.current;

    act(() => {
      onDragStart(createMouseEvent("mousedown", { pageX: 0, pageY: 0 }));
    });

    act(() => {
      endDrag(createMouseEvent("mouseup", { pageX: 100, pageY: 100 }));
    });

    expect(onDragEnd).toHaveBeenCalledTimes(1);
  });

  it("returns default position for unknown event type", () => {
    const { result } = renderHook(() => useDrag());
    const [, { onDragStart }] = result.current;

    act(() => {
      onDragStart({ type: "unknown" } as UIEvent);
    });

    const [state] = result.current;
    expect(state.x).toBe(0);
    expect(state.y).toBe(0);
  });

  it("does not update movement when not dragging on move", () => {
    const { result } = renderHook(() => useDrag());
    const [, { onDragMove }] = result.current;

    act(() => {
      onDragMove(createMouseEvent("mousemove", { pageX: 150, pageY: 150 }));
    });

    const [state] = result.current;
    expect(state.movementX).toBe(0);
    expect(state.movementY).toBe(0);
  });

  it("handles TouchEvent with touch", () => {
    // Create a mock touch event
    const mockTouchEvent = new MouseEvent("touchstart") as unknown as TouchEvent;
    Object.setPrototypeOf(mockTouchEvent, TouchEvent.prototype);
    Object.defineProperty(mockTouchEvent, "touches", {
      value: {
        length: 1,
        item: (idx: number) => ({
          pageX: 50,
          pageY: 60,
        }),
      },
    });

    const { result } = renderHook(() => useDrag());
    const [, { onDragStart }] = result.current;

    act(() => {
      onDragStart(mockTouchEvent as UIEvent);
    });

    const [state] = result.current;
    expect(state.isDragging).toBe(true);
    expect(state.x).toBe(50);
    expect(state.y).toBe(60);
  });

  it("handles TouchEvent with touch for real", () => {
    // jsdom has TouchEvent but not Touch/TouchList. Define them so a
    // genuine TouchEvent can be constructed with proper touches, which
    // exercises the `instanceof TouchEvent` branch and the
    // `event.touches.item(0)?.pageX` lines in toPosition().
    const OrigTouch = (globalThis as any).Touch;
    class Touch {
      pageX: number;
      pageY: number;
      identifier: number;
      target: EventTarget;
      constructor(init: TouchInit) {
        this.identifier = init.identifier;
        this.target = init.target ?? document.body;
        this.pageX = (init as any).pageX ?? 0;
        this.pageY = (init as any).pageY ?? 0;
      }
    }
    (globalThis as any).Touch = Touch;

    const touch = new Touch({ identifier: 0, target: document.body } as any);
    (touch as any).pageX = 50;
    (touch as any).pageY = 60;
    const touchEvent = new TouchEvent("touchstart", {
      touches: [touch] as any,
      bubbles: true,
    });
    // jsdom's TouchList may lack item(); patch it so line 94 is reached
    Object.defineProperty(touchEvent, "touches", {
      value: {
        length: 1,
        item: () => touch,
      },
      configurable: true,
    });

    const { result } = renderHook(() => useDrag());
    const [, { onDragStart }] = result.current;

    act(() => {
      onDragStart(touchEvent as UIEvent);
    });

    const [state] = result.current;
    expect(state.isDragging).toBe(true);
    expect(state.x).toBe(50);
    expect(state.y).toBe(60);

    // Restore original Touch if it existed
    if (OrigTouch !== undefined) {
      (globalThis as any).Touch = OrigTouch;
    }
  });

  it("calls onDragMove with callback when dragging", () => {
    const onDragMove = vi.fn();
    const { result } = renderHook(() => useDrag({ onDragMove }));
    const [, { onDragStart, onDragMove: moveDrag }] = result.current;

    // Start drag first
    act(() => {
      onDragStart(createMouseEvent("mousedown", { pageX: 5, pageY: 5 }));
    });

    // Move while dragging with callback
    act(() => {
      moveDrag(createMouseEvent("mousemove", { pageX: 15, pageY: 25 }));
    });

    expect(onDragMove).toHaveBeenCalled();
  });

  it("does not trigger move callback when drag not started", () => {
    // Verifies the guard at line 174: if (!_state.isDragging) return;
    // The onDragMove callback should not fire when a drag has never been started
    const onDragMove = vi.fn();
    const { result } = renderHook(() => useDrag({ onDragMove }));
    const [, { onDragMove: moveDrag }] = result.current;

    // Move without starting drag first — callback should not fire
    act(() => {
      moveDrag(createMouseEvent("mousemove", { pageX: 150, pageY: 150 }));
    });

    // onDragMove callback should NOT be called because isDragging is false
    expect(onDragMove).not.toHaveBeenCalled();
  });
});
