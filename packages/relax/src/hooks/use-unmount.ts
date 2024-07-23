import { useEffect } from "react";

/**
 * @author murukal
 *
 * @description
 * unmount
 */
export const useUnmount = (callback: () => void) => {
  useEffect(() => {
    return callback;
  }, []);
};
