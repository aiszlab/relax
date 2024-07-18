import { useEffect, useState } from "react";

type MediaQueryCallback = (event: MediaQueryListEvent) => void;

function listen(query: MediaQueryList, callback: MediaQueryCallback) {
  try {
    query.addEventListener("change", callback);
    return () => query.removeEventListener("change", callback);
  } catch (e) {
    query.addListener(callback);
    return () => query.removeListener(callback);
  }
}

export interface UseMediaQueryOptions {
  fallback?: boolean[];
  ssr?: boolean;
}

export const useMediaQuery = (query: string[], { fallback: _fallback, ssr = true }: UseMediaQueryOptions) => {
  const queries = Array.isArray(query) ? query : [query];

  const fallback = _fallback?.filter((v) => v != null) as boolean[];

  const [value, setValue] = useState(() => {
    return queries.map((query, index) => ({
      media: query,
      matches: !ssr ? window.matchMedia?.(query)?.matches : !!fallback[index],
    }));
  });

  useEffect(() => {
    setValue((prev) => {
      const current = queries.map((query) => ({
        media: query,
        matches: window.matchMedia(query).matches,
      }));

      return prev.every((v, i) => v.matches === current[i].matches && v.media === current[i].media) ? prev : current;
    });

    const mediaQueries = queries.map((query) => window.matchMedia(query));

    const handler = (evt: MediaQueryListEvent) => {
      setValue((prev) => {
        return prev.slice().map((item) => {
          if (item.media === evt.media) return { ...item, matches: evt.matches };
          return item;
        });
      });
    };

    const cleanups = mediaQueries.map((v) => listen(v, handler));
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return value.map((item) => item.matches);
};
