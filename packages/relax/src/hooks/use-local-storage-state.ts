import { useStorageState, type UseStorageStateBy } from "./use-storage-state";

export const useLocalStorageState = (key: string, useBy?: UseStorageStateBy) => {
  return useStorageState(key, localStorage, useBy);
};
