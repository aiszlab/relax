import { type RefObject, useEffect, useRef } from "react";
import { useEvent } from "./use-event";
import { debounce } from "../utils/debounce";

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

type UsedInfiniteScroll = [loadable: RefObject<HTMLElement>, scrollable: RefObject<HTMLElement>];

/**
 * @description
 * use infinite scroll
 */
export const useInfiniteScroll = ({
  hasMore = true,
  distance = 0,
  onLoadMore,
}: UsingInfiniteScroll): UsedInfiniteScroll => {
  const loadable = useRef<HTMLElement>(null);
  const scrollable = useRef<HTMLElement>(null);

  const loadMore = useEvent(() => {
    onLoadMore?.();
  });

  useEffect(() => {
    const loader = loadable.current;
    const scroller = scrollable.current;

    if (!hasMore) return;
    if (!scroller) return;

    // use loader if loader is assigned
    if (!!loader) {
      const options = {
        root: scroller,
        rootMargin: `0px 0px ${distance}px 0px`,
        threshold: 0.1,
      };

      const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        if (!entry.isIntersecting) return;

        loadMore();
      }, options);

      observer.observe(loader);

      return () => {
        observer.disconnect();
      };
    }

    // listen scroll event, when loader is not assigned
    const { next, abort } = debounce(() => {
      if (scroller.scrollHeight - scroller.scrollTop > scroller.clientHeight + distance) {
        return;
      }
      loadMore();
    }, 100);

    scroller.addEventListener("scroll", next);

    return () => {
      scroller.removeEventListener("scroll", next);
      abort();
    };
  }, [hasMore]);

  return [loadable, scrollable];
};
