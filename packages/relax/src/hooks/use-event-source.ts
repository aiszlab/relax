import { useRef } from "react";
import { useMounted } from "./use-mounted";

/**
 * @description
 * event source
 */
const useEventSource = () => {
  const eventSourceRef = useRef<EventSource | null>();

  useMounted(() => {
    eventSourceRef.current = new EventSource("");
  });
};

export { useEventSource };
