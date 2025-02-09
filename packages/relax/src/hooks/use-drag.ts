import { useUpdateState } from "./use-update-state";
import { useEvent } from "./use-event";

interface Position {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
}

export type UsingDrag = {
  /** Optional callback invoked upon drag end. */
  onDragEnd?: (state: DragState) => void;
  /** Optional callback invoked upon drag movement. */
  onDragMove?: (state: DragState) => void;
  /** Optional callback invoked upon drag start. */
  onDragStart?: (state: DragState) => void;
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
    onDragEnd: (event: UIEvent) => void;
    onDragMove: (event: UIEvent) => void;
    onDragStart: (event: UIEvent) => void;
  },
];

/**
 * @description convert any event to position
 */
const toPosition = (event: UIEvent): Position => {
  if (event instanceof MouseEvent) {
    return {
      x: event.pageX,
      y: event.pageY,
      offsetX: event.offsetX,
      offsetY: event.offsetY,
    };
  }

  if (event instanceof TouchEvent && event.touches.length === 1) {
    return {
      x: event.touches.item(0)?.pageX ?? 0,
      y: event.touches.item(0)?.pageY ?? 0,
      offsetX: 0,
      offsetY: 0,
    };
  }

  return {
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
  };
};

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

  const onDragStart = useEvent((event: UIEvent) => {
    const { x, y, offsetX, offsetY } = toPosition(event);

    setDragState(
      () => {
        return {
          isDragging: true,
          isDragged: true,
          x,
          y,
          movementX: 0,
          movementY: 0,
          offsetX,
          offsetY,
        };
      },
      _onDragStart &&
        ((_state) => {
          _onDragStart({ ..._state });
        }),
    );
  });

  const onDragMove = useEvent((event: UIEvent) => {
    const position = toPosition(event);

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
          movementX: position.x - x,
          movementY: position.y - y,
        };
      },
      _onDragMove &&
        ((_state) => {
          if (!_state.isDragging) return;
          _onDragMove({ ..._state });
        }),
    );
  });

  const onDragEnd = useEvent((event: UIEvent) => {
    const { x, y } = toPosition(event);

    setDragState(
      (_state) => ({
        isDragging: false,
        isDragged: true,
        x: x - _state.offsetX,
        y: y - _state.offsetY,
        movementX: 0,
        movementY: 0,
        offsetX: 0,
        offsetY: 0,
      }),
      _onDragEnd &&
        ((_state) => {
          _onDragEnd({ ..._state });
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
