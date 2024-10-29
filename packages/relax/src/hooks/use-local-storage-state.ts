import { useStorageState, type UsingStorageState } from "./use-storage-state";

export const useLocalStorageState = (key: string, using?: UsingStorageState) => {
  return useStorageState(key, globalThis.localStorage, using);
};
