import { useStorage, type UseStorageBy } from "./use-storage";

export const useSessionStorage = (key: string, useBy?: UseStorageBy) => {
  return useStorage(key, sessionStorage, useBy);
};
