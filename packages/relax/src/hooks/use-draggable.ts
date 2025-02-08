import { useEffect, useRef } from "react";
import { useDrag } from "./use-drag";
import { useMounted } from "./use-mounted";

export const useDraggable = <T extends HTMLElement = HTMLElement>() => {
  const [dragState, { onDragStart, onDragEnd, onDragMove }] = useDrag();
  const draggableRef = useRef<T>(null);
  const { isDragging } = dragState;

  useMounted(() => {
    const _draggable = draggableRef.current;
    if (!_draggable) return;

    _draggable.addEventListener("mousedown", onDragStart);
    _draggable.addEventListener("touchstart", onDragStart);

    return () => {
      _draggable.removeEventListener("mousedown", onDragStart);
      _draggable.removeEventListener("touchstart", onDragStart);
    };
  });

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("touchmove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
    window.addEventListener("touchend", onDragEnd);

    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("touchmove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
      window.removeEventListener("touchend", onDragEnd);
    };
  }, [isDragging]);

  return [draggableRef, dragState] as const;
};
