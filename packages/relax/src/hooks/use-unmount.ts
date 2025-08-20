import { useEffect } from "react";
import { useMounted } from "./use-mounted";

/**
 * @author murukal
 *
 * @description
 * unmount
 */
export const useUnmount = (callback: () => void) => {
  useMounted(() => {
    return callback;
  });
};
