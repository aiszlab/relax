import { useRef } from "react";

interface Cache<Value, Condition> {
  condition: Condition;
  value: Value;
}

export const useMemorable = <Value, Condition = unknown[]>(
  getter: () => Value,
  condition: Condition,
  shouldUpdate: (prev: Condition, next: Condition) => boolean,
) => {
  const cacheRef = useRef<Cache<Value, Condition> | null>(null);

  if (cacheRef.current === null || shouldUpdate(cacheRef.current.condition, condition)) {
    cacheRef.current = {
      value: getter(),
      condition,
    };
  }

  return cacheRef.current.value;
};
