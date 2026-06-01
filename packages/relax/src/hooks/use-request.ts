import { useCallback, useRef, useState } from "react";
import { useEvent } from "./use-event";
import { useMounted } from "./use-mounted";

type UsingRequest<T> = {
  /**
   * @description
   * auto request when component mounts
   */
  auto?: boolean;

  /**
   * @description
   * called when the request succeeds, like Promise.then
   */
  then?: (data: T) => void;

  /**
   * @description
   * called when the request fails, like Promise.catch
   */
  catch?: (error: Error) => void;

  /**
   * @description
   * called when the request completes (success or failure), like Promise.finally
   */
  finally?: () => void;
};

type UsedRequest<T> = {
  /**
   * @description
   * response data
   */
  data: T | null;

  /**
   * @description
   * error caught from the request
   */
  error: Error | null;

  /**
   * @description
   * whether the request is in progress
   */
  loading: boolean;

  /**
   * @description
   * manually trigger the request with the same arguments as the source function
   */
  run: (...args: any[]) => Promise<void>;
};

/**
 * @author murukal
 *
 * @description
 * wraps an async request function, tracking loading / error / data state.
 * when `auto` is true the request fires automatically on mount.
 */
export const useRequest = <T>(
  request: (...args: any[]) => Promise<T>,
  {
    auto = false,
    then: thenCallback,
    catch: catchCallback,
    finally: finallyCallback,
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

  const run = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    const result = await _request(...args)
      .then(_then)
      .catch(_catch)
      .finally(_finally);

    setData(result);
    setLoading(false);
  }, []);

  useMounted(() => {
    if (isMountedRef.current) return;
    if (!auto) return;

    isMountedRef.current = true;
    run();
  });

  return { data, error, loading, run };
};
