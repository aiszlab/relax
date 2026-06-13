import { type DependencyList, useEffect, useRef, useState } from "react";
import { useEvent } from "./use-event";
import { useDebounceCallback } from "./use-debounce-callback";

type UsingRequest<T> = {
  /**
   * auto request when component mounts
   */
  auto?: boolean;

  /**
   * called when the request succeeds, like Promise.then
   */
  then?: (data: T) => void;

  /**
   * called when the request fails, like Promise.catch
   */
  catch?: (error: Error) => void;

  /**
   * called when the request completes (success or failure), like Promise.finally
   */
  finally?: () => void;

  /**
   * debounce delay in milliseconds. setting this enables debounce mode —
   * rapid calls to `run` will be coalesced and only the last call within
   * the window will execute.
   *
   * @zh 防抖延迟时间（毫秒）。设置后启用防抖模式——对 `run` 的快速调用
   * 会被合并，在时间窗口内仅执行最后一次调用。
   */
  debounceWait?: number;

  /**
   * dependency list. when any value in this array changes (after initial
   * mount), the request is automatically re-executed.
   *
   * @zh 依赖项列表。数组中的任意值发生变化时（首次挂载后），自动重新请求数据。
   */
  deps?: DependencyList;
};

type UsedRequest<T> = {
  /**
   * response data
   */
  data: T | null;

  /**
   * error caught from the request
   */
  error: Error | null;

  /**
   * whether the request is in progress
   */
  loading: boolean;

  /**
   * manually trigger the request with the same arguments as the source function.
   * when `debounceWait` is set calls are debounced — the returned Promise
   * resolves only when the call is actually executed.
   */
  run: (...args: any[]) => Promise<void>;
};

/**
 * @author murukal
 *
 * wraps an async request function, tracking loading / error / data state.
 * when `auto` is true the request fires automatically on mount.
 *
 * supports debounce via `debounceWait` option which accepts dynamic updates.
 */
export const useRequest = <T>(
  request: (...args: any[]) => Promise<T>,
  {
    auto = false,
    then: thenCallback,
    catch: catchCallback,
    finally: finallyCallback,
    debounceWait,
    deps,
  }: UsingRequest<T> = {},
): UsedRequest<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(false);

  const _request = useEvent(request);

  const _then = useEvent((_data: T) => {
    thenCallback?.(_data);
    return _data;
  });

  const _catch = useEvent((error: any) => {
    catchCallback?.(error);
    setError(error);
    return null;
  });

  const _finally = useEvent(() => {
    finallyCallback?.();
  });

  // ---- core execution (always stable) ----

  const _execute = useEvent(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    const result = await _request(...args)
      .then(_then)
      .catch(_catch)
      .finally(_finally);

    setData(result);
    setLoading(false);
  });

  const debounced = useDebounceCallback(_execute, debounceWait);

  const run = useEvent((...args: any[]): Promise<void> => {
    if (!debounceWait) {
      return _execute(...args);
    }

    return Promise.resolve(debounced.next(...args));
  });

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;

      if (!auto) return;
      _execute();
      return;
    }

    _execute();
  }, deps ?? []);

  return { data, error, loading, run };
};
