import { useState } from "react";
import { useMounted } from "./use-mounted";
import type { Nullable } from "../types";

/**
 * @description
 * network
 */
export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);

  useMounted(() => {
    let onOnline: Nullable<VoidFunction> = () => {
      setIsOnline(true);
    };
    let onOffline: Nullable<VoidFunction> = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      onOnline && window.removeEventListener("online", onOnline);
      onOffline && window.removeEventListener("offline", onOffline);
      onOnline = null;
      onOffline = null;
    };
  });

  return isOnline;
};
