import { useStorageState, type UsingStorageState } from "./use-storage-state";

export const useSessionStorageState = (key: string, using?: UsingStorageState) => {
  return useStorageState(key, sessionStorage, using);
};
