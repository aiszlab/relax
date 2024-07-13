import { useCallback, useState } from "react";

type UsedForceUpdate = [number, () => void];

/**
 * @description
 * force update
 */
export const useForceUpdate = (): UsedForceUpdate => {
  const [times, setTimes] = useState(1);

  const forceUpdate = useCallback(() => {
    setTimes((prev) => prev + 1);
  }, []);

  return [times, forceUpdate];
};
