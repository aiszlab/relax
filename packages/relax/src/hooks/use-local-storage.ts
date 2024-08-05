import { useStorage, type UseStorageBy } from "./use-storage";

export const useLocalStorage = (key: string, useBy?: UseStorageBy) => {
  return useStorage(key, localStorage, useBy);
};
