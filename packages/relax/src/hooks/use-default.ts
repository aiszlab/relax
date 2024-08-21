import { useMemo } from "react";
import type { State } from "@aiszlab/relax/types";
import { toFunction } from "../utils/to-function";

/**
 * @author murukal
 *
 * @description
 * state always be same after first render
 */
export const useDefault = <T>(initialState: State<T>) => {
  return useMemo(toFunction<() => T>(initialState), []);
};
