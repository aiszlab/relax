import { useRef, useState } from "react";
import { useMounted } from "./use-mounted";

type UseIsMountedBy = {
  /**
   * @description
   * after mount, react will rerender current component
   */
  rerender?: boolean;
};

/**
 * @description
 * `useIsMounted`
 */
export const useIsMounted = ({ rerender = false }: UseIsMountedBy = {}) => {
  const [, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);

  useMounted(() => {
    isMountedRef.current = true;

    if (rerender) {
      setIsMounted(true);
    }

    return () => {
      isMountedRef.current = false;
    };
  });

  // only use callback
  // avoid parent component or hooks change isMountedRef.current
  return () => isMountedRef.current;
};
