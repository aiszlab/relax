import { useCallback, useEffect, useMemo, useState } from "react";
import { toArray } from "../utils/to-array";
import { replaceAt } from "../utils/replace";
import { isDomUsable } from "../is/is-dom-usable";

export const useMediaQuery = (query: string[] | string) => {
  const queries = useMemo(() => toArray(query), [query]);
  const _query = useMemo(() => JSON.stringify(query), [query]);

  const [value, setValue] = useState(() => {
    if (!isDomUsable()) return [];
    return queries.map((query) => !!globalThis.matchMedia(query).matches);
  });

  const changeIsMatched = useCallback((event: MediaQueryListEvent, index: number) => {
    setValue((prev) => replaceAt(prev, index, event.matches));
  }, []);

  // only run when dom is usable
  // when hook is executed, add listener to all media queries
  // then on hook unmount, remove all listeners
  useEffect(() => {
    if (!isDomUsable()) return;

    const mediaQueries = queries.map((_query) => globalThis.matchMedia(_query));

    const cleaners = mediaQueries.map((mediaQuery, index) => {
      const listener = (event: MediaQueryListEvent) => changeIsMatched(event, index);
      mediaQuery.addEventListener("change", listener);

      return () => {
        mediaQuery.removeEventListener("change", listener);
      };
    });

    return () => {
      cleaners.forEach((cleaner) => {
        cleaner();
      });
    };
  }, [_query]);

  return value;
};
