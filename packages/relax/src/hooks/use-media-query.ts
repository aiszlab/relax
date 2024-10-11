import { useCallback, useEffect, useMemo, useState } from "react";
import { toArray } from "../utils/to-array";
import { replace } from "../utils/replace";

export const useMediaQuery = (query: string[] | string) => {
  const _query = useMemo(() => query.toString(), [query]);
  const queries = toArray(query);

  const [value, setValue] = useState(() => {
    return queries.map((query) => !!globalThis.window.matchMedia?.(query)?.matches);
  });

  const onMediaQueryChange = useCallback((event: MediaQueryListEvent, index: number) => {
    setValue((prev) => replace(prev, event.matches, index));
  }, []);

  useEffect(() => {
    const mediaQueries = queries.map((query) => globalThis.window.matchMedia(query));

    // listen media query change
    const cleaners = mediaQueries.map((mediaQuery, index) => {
      const listener = (event: MediaQueryListEvent) => onMediaQueryChange(event, index);
      mediaQuery.addEventListener("change", listener);

      return () => {
        mediaQuery.removeEventListener("change", listener);
      };
    });

    // clean up all listeners
    return () => {
      cleaners.forEach((cleaner) => {
        cleaner();
      });
    };
  }, [_query]);

  return value;
};
