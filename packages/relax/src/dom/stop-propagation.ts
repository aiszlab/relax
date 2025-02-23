interface _Event {
  stopPropagation(): void;
}

/**
 * @description same as e.stopPropagation()
 */
export function stopPropagation<E extends _Event>(e: E) {
  e.stopPropagation();
}
