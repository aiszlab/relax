import { useEffect, useMemo, useRef } from "react";
import { Observable, delay, type Subscription, type Subscriber, timer } from "rxjs";
import { useEvent } from "./use-event";
import { useMounted } from "./use-mounted";

/**
 * @author murukal
 *
 * @description
 * timeout effect
 */
export const useTimeout = (callback: Function, wait: number) => {
  const trigger = useRef<Subscriber<void> | null>(null);
  const timed = useRef<Subscription | null>(null);

  const callable = useEvent(callback);

  useMounted(() => {
    new Observable((_) => {
      trigger.current = _;
    }).subscribe({
      complete: () => callable(),
    });
  });

  // when user what to flush timeout handler
  // if trigger already registed, just complete trigger
  // not registed, call `handler` manaully
  const flush = useEvent(() => {
    if (trigger.current) {
      trigger.current.complete();
    } else {
      callback();
    }

    timed.current?.unsubscribe();
    timed.current = null;
    trigger.current = null;
  });

  // cancel
  const cancel = useEvent(() => {
    trigger.current?.error();
    timed.current?.unsubscribe();
    timed.current = null;
  });

  // add timer for `wait`
  useEffect(() => {
    // if 0, always mean not need to set timeout
    if (wait <= 0) {
      return;
    }

    const _timed = timer(wait).subscribe(() => {
      trigger.current?.complete();
    });
    timed.current = _timed;

    return () => {
      _timed.unsubscribe();
      timed.current = null;
    };
  }, [wait]);

  return {
    flush,
    cancel,
  };
};
