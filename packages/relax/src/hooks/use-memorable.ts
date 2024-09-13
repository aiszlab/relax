import { useEffect, useRef } from "react";
import { useDefault } from "./use-default";

interface Cache<Value, Condition> {
  condition: Condition;
  value: Value;
}

export const useMemorable = <Value, Condition = unknown[]>(
  getter: () => Value,
  condition: Condition,
  shouldUpdate: (prev: Condition, next: Condition) => boolean,
) => {
  const isMounted = useRef(false);
  const cacheRef = useRef<Cache<Value, Condition>>({
    value: useDefault(getter),
    condition,
  });

  useEffect(() => {
    // value has got in the first render, skip this render time
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (!shouldUpdate(cacheRef.current.condition, condition)) return;

    cacheRef.current = {
      value: getter(),
      condition,
    };
  });

  return cacheRef.current.value;
};
