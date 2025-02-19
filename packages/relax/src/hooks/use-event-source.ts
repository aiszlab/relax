import { useRef } from "react";
import { useMounted } from "./use-mounted";
import type { Nullable } from "../types";

/**
 * @description
 * fetch event source
 */
const useEventSource = (url: string) => {
  const eventSourceRef = useRef<Nullable<EventSource>>(null);

  useMounted(() => {
    const _eventSource = (eventSourceRef.current = new EventSource(url));

    return () => {
      _eventSource.close();
    };
  });
};

export { useEventSource };
