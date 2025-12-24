import { useMemo, useRef } from "react";
import { useDefault } from "./use-default";

/**
 * useMemo 作为一个同步函数，在组件`render`过程中会阻塞浏览器渲染
 * useLazyMemo 仅当组件内部需要访问数据时，才会执行计算
 */
const useLazyMemo = <T>(fn: () => T, deps: unknown[]) => {
  const memorizedValue = useRef<T | null>(null);

  useMemo(() => {
    memorizedValue.current = null;
  }, [deps]);

  const compute = useDefault(() => {
    return new Proxy<{ value: T }>(
      { value: null as T },
      {
        get(target, key) {
          if (key !== "value") {
            return Reflect.get(target, key);
          }

          return memorizedValue.current ?? fn();
        },
      },
    );
  });

  return compute;
};

export { useLazyMemo };
