import { useCallback, useRef, useState } from "react";
import { useEvent } from "./use-event";
import { useMounted } from "./use-mounted";

type UsingRequest = {
  /**
   * @description
   * auto request when component mounts
   */
  auto?: boolean;
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
  { auto = false }: UsingRequest = {},
): UsedRequest<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(false);

  const _request = useEvent(request);

  const run = useCallback(async (...args: any[]) => {
    setLoading(true);
    setError(null);

    const result = await _request(...args).catch((error) => {
      setError(error);
      return null;
    });

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
