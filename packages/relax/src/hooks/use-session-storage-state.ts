import { useStorageState, type UseStorageStateBy } from "./use-storage-state";

export const useSessionStorageState = (key: string, useBy?: UseStorageStateBy) => {
  return useStorageState(key, sessionStorage, useBy);
};
