import { useEffect, useMemo, useRef } from "react";
import { type Nullable } from "../types";

/**
 * @description 基于`React`.`useMemo`的增强
 * 在依赖发生改变时，具备读取上一次`useMemo`结果的能力
 */
export const useMemorized = <T>(
  factory: (previous: Nullable<T>) => T,
  deps: readonly unknown[],
): T => {
  const _previousMemorized = useRef<T>(null);

  const _memorized = useMemo(() => {
    return factory(_previousMemorized.current);
  }, deps);

  useEffect(() => {
    _previousMemorized.current = _memorized;
  });

  return _memorized;
};
