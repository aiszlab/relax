import { type RefObject, useEffect, useRef } from "react";
import { useEvent } from "./use-event";
import { debounce } from "../utils/debounce";
import { first } from "../utils/first";

type UsingInfiniteScroll = {
  /**
   * @description
   * hasMore
   */
  hasMore?: boolean;

  /**
   * @description
   * distance
   */
  distance?: number;

  /**
   * @description
   * load more handler
   */
  onLoadMore?: () => void;
};

type UsedInfiniteScroll<S, V> = [sentinelRef: RefObject<S>, viewportRef: RefObject<V>];

/**
 * @description
 * use infinite scroll
 */
export const useInfiniteScroll = <
  S extends HTMLElement = HTMLElement,
  V extends HTMLElement = HTMLElement,
>({ hasMore = true, distance = 0, onLoadMore }: UsingInfiniteScroll = {}): UsedInfiniteScroll<
  S,
  V
> => {
  const sentinelRef = useRef<S>(null);
  const viewportRef = useRef<V>(null);

  // `useEvent` keep loadMore always the same
  const loadMore = useEvent(() => {
    onLoadMore?.();
  });

  useEffect(() => {
    const _sentinel = sentinelRef.current;
    const _viewport = viewportRef.current ?? globalThis.window.document.body;

    // no more data, never listen
    if (!hasMore) return;

    // when _sentinel is not provided
    // use `scroll` event to listen `viewport`
    // it is not recommended, has performance issue!!!
    if (!_sentinel) {
      const { next, abort } = debounce(() => {
        if (_viewport.scrollHeight - _viewport.scrollTop > _viewport.clientHeight + distance) {
          return;
        }
        loadMore();
      }, 200);

      _viewport.addEventListener("scroll", next);

      return () => {
        abort();
        _viewport.removeEventListener("scroll", next);
      };
    }

    // use `IntersectionObserver` to check current node is in viewport
    const _listener = new IntersectionObserver(
      (entries) => {
        const _element = first(entries);
        if (!_element) return;
        if (!_element.isIntersecting) return;
        loadMore();
      },
      {
        root: _viewport,
        rootMargin: `0px 0px ${distance}px 0px`,
      },
    );
    _listener.observe(_sentinel);

    return () => {
      _listener.unobserve(_sentinel);
      _listener.disconnect();
    };
  }, [hasMore]);

  return [sentinelRef, viewportRef];
};
