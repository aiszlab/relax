export type Orientation = "horizontal" | "vertical";

class Scroller {
  #scrolled = new Map<HTMLElement, number>();

  // singleton mode
  static #scroller: Scroller | null = null;

  constructor() {
    return (Scroller.#scroller ??= this);
  }

  get scrolled() {
    return this.#scrolled;
  }

  currentAt(orientation: Orientation): Extract<keyof HTMLElement, "scrollTop" | "scrollLeft"> {
    return orientation === "vertical" ? "scrollTop" : "scrollLeft";
  }
}

interface ScrollBy {
  /**
   * @description
   * duration
   */
  duration: number;

  /**
   * @description
   * orientation
   */
  orientation?: Orientation;
}

/**
 * @description
 * scroll to for wrapper element
 */
export const scrollTo = (
  target: HTMLElement,
  to: number,
  { duration = 0, orientation = "vertical" }: ScrollBy = {
    duration: 0,
    orientation: "vertical",
  },
): void => {
  const scroller = new Scroller();
  const scrolled = scroller.scrolled.get(target);
  const currentAtProperty = scroller.currentAt(orientation);

  if (scrolled) {
    cancelAnimationFrame(scrolled);
    scroller.scrolled.delete(target);
  }

  // if duration <= 0, jump immediately
  if (duration <= 0) {
    scroller.scrolled.set(
      target,
      requestAnimationFrame(() => {
        target[currentAtProperty] = to;
      }),
    );
    return;
  }

  // animate
  const currentAt = target[currentAtProperty];
  const difference = to - currentAt;
  const step = (difference / duration) * 10;

  scroller.scrolled.set(
    target,
    requestAnimationFrame(() => {
      target[currentAtProperty] = currentAt + step;

      // over end, stop any animation
      if (target[currentAtProperty] === to) return;

      scrollTo(target, to, {
        duration: duration - 10,
        orientation,
      });
    }),
  );
};
