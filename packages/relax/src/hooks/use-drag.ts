import { type DragEvent } from "react";
import { useUpdateState } from "./use-update-state";
import { useEvent } from "./use-event";

export type UsingDrag = {
  /** Optional callback invoked upon drag end. */
  onDragEnd?: (event: DragEvent<HTMLDivElement>, state: DragState) => void;
  /** Optional callback invoked upon drag movement. */
  onDragMove?: (event: DragEvent<HTMLDivElement>, state: DragState) => void;
  /** Optional callback invoked upon drag start. */
  onDragStart?: (event: DragEvent<HTMLDivElement>, state: DragState) => void;
};

export type DragState = {
  /**
   * @description
   * x position
   */
  x: number;

  /**
   * @description
   * y position
   */
  y: number;

  /**
   * @description
   * offset X
   */
  offsetX?: number;

  /**
   * @description
   * offset Y
   */
  offsetY?: number;

  /**
   * @description
   * Whether a drag is currently in progress.
   */
  isDragging: boolean;
};

export type UsedDrag = [
  DragState,
  {
    onDragEnd: (event: DragEvent<HTMLDivElement>) => void;
    onDragMove: (event: DragEvent<HTMLDivElement>) => void;
    onDragStart: (event: DragEvent<HTMLDivElement>) => void;
  },
];

/**
 * @description
 * Hook for dragging
 */
export default function useDrag({
  onDragEnd: _onDragEnd,
  onDragMove: _onDragMove,
  onDragStart: _onDragStart,
}: UsingDrag | undefined = {}): UsedDrag {
  const [dragState, setDragState] = useUpdateState<DragState>({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
  });

  const onDragStart = useEvent((event: DragEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      () => {
        return {
          isDragging: true,
          offsetX: 0,
          offsetY: 0,
          x: event.clientX,
          y: event.clientY,
        };
      },
      _onDragStart &&
        ((_state) => {
          _onDragStart(event, { ..._state });
        }),
    );
  });

  const onDragMove = useEvent((event: DragEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      (_state) => {
        if (!_state.isDragging) return _state;

        const { x, y } = _state;

        return {
          ..._state,
          dx: event.clientX - x,
          dy: event.clientY - y,
        };
      },
      _onDragMove &&
        ((_state) => {
          if (!_state.isDragging) return;
          _onDragMove(event, { ..._state });
        }),
    );
  });

  const onDragEnd = useEvent((event: DragEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      (_state) => ({ ..._state, isDragging: false }),
      _onDragEnd &&
        ((_state) => {
          _onDragEnd(event, { ..._state });
        }),
    );
  });

  return [
    dragState,
    {
      onDragEnd,
      onDragMove,
      onDragStart,
    },
  ];
}
