import { useState, useEffect, useRef, type HTMLAttributeReferrerPolicy } from "react";
import { Observable, type Subscriber } from "rxjs";

type Status = "none" | "loading" | "error" | "loaded";

interface Props {
  src?: string;
  crossOrigin?: string;
  referrerPolicy?: HTMLAttributeReferrerPolicy;
}

/**
 * @author murukal
 *
 * @description
 * image loader
 */
export const useImageLoader = ({ src, crossOrigin, referrerPolicy = "no-referrer" }: Props) => {
  const loader = useRef<Subscriber<void>>();
  const [status, setStatus] = useState<Status>("none");

  useEffect(() => {
    if (!src) {
      return setStatus("none");
    }

    // create observable to listen img status
    new Observable<void>((subscriber) => {
      loader.current = subscriber;
      subscriber.next();
    }).subscribe({
      next: () => setStatus("loading"),
      complete: () => setStatus("loaded"),
      error: () => setStatus("error"),
    });

    const load = () => {
      loader.current?.complete();
    };
    const error = () => {
      loader.current?.error(null);
    };

    const image = new Image();
    image.addEventListener("load", load);
    image.addEventListener("error", error);

    image.crossOrigin = crossOrigin ?? null;
    image.referrerPolicy = referrerPolicy;
    image.src = src;

    return () => {
      image.removeEventListener("load", load);
      image.removeEventListener("error", error);
      image.remove();
    };
  }, [src, crossOrigin, referrerPolicy]);

  return status;
};
