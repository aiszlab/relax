import { useEffect, useRef, useState } from "react";
import { useMounted } from "./use-mounted";

type UseIsMountedProps = {
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
export const useIsMounted = ({ rerender = false }: UseIsMountedProps) => {
  const [, setIsMounted] = useState(false);
  const isMountedRef = useRef(false);

  useMounted(() => {
    isMountedRef.current = true;

    if (rerender) {
      setIsMounted(true);
    }

    return () => {
      isMountedRef.current = false;
      setIsMounted(false);
    };
  });

  return isMountedRef.current;
};
