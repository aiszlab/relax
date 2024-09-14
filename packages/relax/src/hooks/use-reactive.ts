import { useRef, useState } from "react";
import type { State } from "@aiszlab/relax/types";
import { useEvent } from "./use-event";

type Reactive<T> = {
  value: T;
};

/**
 * @description
 * use reactive
 */
const useReactive = <T>(initialState: State<T>) => {
  const [_state, _setState] = useState<T>(initialState);

  const getter = useEvent(() => {
    return _state;
  });

  const setter = useEvent((_target: Reactive<T>, _key: keyof Reactive<T>, value: T) => {
    _setState(value);
    return true;
  });

  const ref = useRef(
    new Proxy(
      { value: _state },
      {
        get: getter,
        set: setter,
      },
    ),
  );

  return ref.current;
};

export { useReactive };
