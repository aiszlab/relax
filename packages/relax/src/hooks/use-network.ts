import { useEffect, useState } from "react";
import { useMounted } from "./use-mounted";

/**
 * @description
 * network
 */
export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState<boolean>(() => navigator.onLine);

  useMounted(() => {
    const onOnline = () => {
      setIsOnline(true);
    };

    const onOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  });

  return isOnline;
};
