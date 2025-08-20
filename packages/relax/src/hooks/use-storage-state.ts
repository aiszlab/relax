import { useCallback, useEffect, useState } from "react";
import { isNull } from "../is/is-null";

export type UsedStorageState = [string | null, (value: string | null) => void];

export type UsingStorageState = {
  listen?: boolean;
};

export const useStorageState = (
  key: string,
  storage: Storage,
  { listen = true }: UsingStorageState = {},
): UsedStorageState => {
  const [state, setState] = useState(() => storage.getItem(key));

  // effect sync state after key change
  useEffect(() => {
    setState(storage.getItem(key));
  }, [key]);

  useEffect(() => {
    const onStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;
      if (event.storageArea !== storage) return;
      setState(event.newValue);
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
      // handler set, change state anytime
      setState(value);

      if (isNull(value)) {
        storage.removeItem(key);
        return;
      }

      storage.setItem(key, value);
    },
    [key, listen],
  );

  return [state, setter];
};
