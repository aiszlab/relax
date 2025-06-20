import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from "react";
import { clamp } from "../utils/clamp";
import type { State } from "@aiszlab/relax/types";
import { useDefault } from "./use-default";
import { useEvent } from "./use-event";

type Props = {
  /**
   * @description
   * max: count will not be greater than max
   */
  max?: number;

  /**
   * @description
   * min: count will not be smaller than min
   */
  min?: number;
};

type UsedCounter = [
  number,
  {
    add: (step?: number) => void;
    subtract: (step?: number) => void;
    first: () => void;
    last: () => void;
    reset: () => void;
    setCount: Dispatch<SetStateAction<number>>;
  },
];

/**
 * @author murukal
 *
 * @description
 * a number counter with some useful apis
 */
export const useCounter = (
  initialState: State<number> = 0,
  { max = Infinity, min = -Infinity }: Props = {},
): UsedCounter => {
  const [_count, _setCount] = useState(initialState);
  // memorized first time prop value
  const defaultState = useDefault(initialState);

  const add = useEvent((step = 1) => {
    _setCount((prev) => Math.min(max, prev + step));
  });

  const subtract = useEvent((step = 1) => {
    _setCount((prev) => Math.max(min, prev - step));
  });

  const first = useEvent(() => {
    _setCount(min);
  });

  const last = useEvent(() => {
    _setCount(max);
  });

  const reset = useCallback(() => {
    _setCount(defaultState);
  }, []);

  const count = useMemo(() => clamp(_count, min, max), [_count, min, max]);

  return [count, { add, subtract, first, last, reset, setCount: _setCount }];
};
