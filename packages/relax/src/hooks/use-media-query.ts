import { useEffect, useMemo, useState } from "react";
import { toArray } from "../utils/to-array";
import { useEvent } from "./use-event";
import { replace } from "../utils/replace";

export const useMediaQuery = (query: string[] | string) => {
  const _query = useMemo(() => query.toString(), [query]);
  const queries = toArray(query);

  const [value, setValue] = useState(() => {
    return queries.map((query) => !!window.matchMedia?.(query)?.matches);
  });

  const onMediaQueryChange = useEvent((event: MediaQueryListEvent, index: number) => {
    setValue((prev) => replace(prev, { index, replaceValue: event.matches }));
  });

  useEffect(() => {
    const mediaQueries = queries.map((query) => window.matchMedia(query));

    // listen media query change
    const cleaners = mediaQueries.map((mediaQuery, index) => {
      const listener = (event: MediaQueryListEvent) => onMediaQueryChange(event, index);
      mediaQuery.addEventListener("change", listener);
      return () => mediaQuery.removeEventListener("change", listener);
    });

    // clean up all listeners
    return () => cleaners.forEach((cleaner) => cleaner());
  }, [_query]);

  return value;
};
