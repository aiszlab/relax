import { useRef } from "react";

/**
 * in react, ref always need a initial value
 * but can not be a function
 * so we create a lazy ref to get a value getter
 */
function useLazyRef<T>(getter: () => T) {
  const ref = useRef<T | null>(null);

  return () => {
    return (ref.current ??= getter());
  };
}

export { useLazyRef };
