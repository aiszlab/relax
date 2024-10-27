import { type MouseEvent } from "react";
import { useUpdateState } from "./use-update-state";
import { useEvent } from "./use-event";

export type UsingDrag = {
  /** Optional callback invoked upon drag end. */
  onDragEnd?: (event: MouseEvent<HTMLDivElement>, state: DragState) => void;
  /** Optional callback invoked upon drag movement. */
  onDragMove?: (event: MouseEvent<HTMLDivElement>, state: DragState) => void;
  /** Optional callback invoked upon drag start. */
  onDragStart?: (event: MouseEvent<HTMLDivElement>, state: DragState) => void;
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
   * moved x
   */
  movementX: number;

  /**
   * @description
   * moved y
   */
  movementY: number;

  /**
   * @description
   * offset X
   */
  offsetX: number;

  /**
   * @description
   * offset Y
   */
  offsetY: number;

  /**
   * @description
   * Whether a drag is currently in progress.
   */
  isDragging: boolean;

  /**
   * @description
   * isDragged
   */
  isDragged: boolean;
};

export type UsedDrag = [
  DragState,
  {
    onDragEnd: (event: MouseEvent<HTMLDivElement>) => void;
    onDragMove: (event: MouseEvent<HTMLDivElement>) => void;
    onDragStart: (event: MouseEvent<HTMLDivElement>) => void;
  },
];

/**
 * @description
 * Hook for dragging
 */
const useDrag = ({
  onDragEnd: _onDragEnd,
  onDragMove: _onDragMove,
  onDragStart: _onDragStart,
}: UsingDrag | undefined = {}): UsedDrag => {
  const [dragState, setDragState] = useUpdateState<DragState>({
    x: 0,
    y: 0,
    movementX: 0,
    movementY: 0,
    offsetX: 0,
    offsetY: 0,
    isDragging: false,
    isDragged: false,
  });

  const onDragStart = useEvent((event: MouseEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      () => {
        return {
          isDragging: true,
          isDragged: true,
          x: event.clientX,
          y: event.clientY,
          movementX: 0,
          movementY: 0,
          offsetX: event.nativeEvent.layerX,
          offsetY: event.nativeEvent.layerY,
        };
      },
      _onDragStart &&
        ((_state) => {
          _onDragStart(event, { ..._state });
        }),
    );
  });

  const onDragMove = useEvent((event: MouseEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      (_state) => {
        if (!_state.isDragging) return _state;

        const { x, y, offsetX, offsetY } = _state;

        return {
          isDragging: true,
          isDragged: true,
          x,
          y,
          offsetX,
          offsetY,
          movementX: event.clientX - x,
          movementY: event.clientY - y,
        };
      },
      _onDragMove &&
        ((_state) => {
          if (!_state.isDragging) return;
          _onDragMove(event, { ..._state });
        }),
    );
  });

  const onDragEnd = useEvent((event: MouseEvent<HTMLDivElement>) => {
    event.persist();

    setDragState(
      (_state) => ({
        isDragging: false,
        isDragged: true,
        x: event.clientX - _state.offsetX,
        y: event.clientY - _state.offsetY,
        movementX: 0,
        movementY: 0,
        offsetX: 0,
        offsetY: 0,
      }),
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
};

export { useDrag };
