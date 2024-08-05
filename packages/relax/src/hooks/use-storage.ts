import { useCallback, useEffect, useState } from "react";
import { isNull } from "../is/is-null";

export type UsedStorage = [string | null, (value: string | null) => void];

export type UseStorageBy = {
  listen?: boolean;
};

export const useStorage = (
  key: string,
  storage: Storage,
  { listen = true }: UseStorageBy = {},
): UsedStorage => {
  const [state, setState] = useState(() => storage.getItem(key));

  // effect sync state after key change
  useEffect(() => {
    setState(storage.getItem(key));
  }, [key]);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.storageArea !== storage) return;
    };

    // only listen with flag = `true`
    if (listen) {
      window.addEventListener("storage", onStorageChange);
    }

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, [listen]);

  // change handler
  const setter = useCallback(
    (value: string | null) => {
      if (listen) {
        if (isNull(value)) {
          storage.removeItem(key);
        } else {
          storage.setItem(key, value);
        }
        return;
      }

      setState(value);
    },
    [key, listen],
  );

  return [state, setter];
};
